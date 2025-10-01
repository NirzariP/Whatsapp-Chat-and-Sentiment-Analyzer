import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import base64
from wordcloud import WordCloud

# Time-Based Sentiment Analysis
def time_based_sentiment(df, selected_user=None):
    if selected_user and selected_user != "Overall":
        df = df[df["user"] == selected_user]

    daily_sentiment = df.groupby("date")["Sentiment Score"].mean().reset_index()
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.lineplot(data=daily_sentiment, x="date", y="Sentiment Score", marker="o", color="blue", ax=ax)
    ax.axhline(0, color="gray", linestyle="--")
    ax.set_title("Sentiment Trend Over Time")
    ax.set_xlabel("Date")
    ax.set_ylabel("Average Sentiment Score")
    fig.autofmt_xdate()

    buffer = BytesIO()
    fig.savefig(buffer, format='png', bbox_inches='tight')
    buffer.seek(0)
    plt.close(fig)
    return base64.b64encode(buffer.getvalue()).decode('utf-8')


# User-Specific Sentiment Trends
def user_sentiment_trends(df, selected_user=None):
    if selected_user and selected_user != "Overall":
        user_sentiment = df[df["user"] == selected_user].groupby("user")["Sentiment Score"].mean().reset_index()
    else:
        user_sentiment = df.groupby("user")["Sentiment Score"].mean().reset_index()

    fig, ax = plt.subplots(figsize=(12, 5))
    sns.barplot(data=user_sentiment, x="user", y="Sentiment Score", palette="coolwarm", ax=ax)
    ax.axhline(0, color="black", linestyle="--")
    ax.set_title("User-Specific Sentiment Trends")
    ax.set_xlabel("User")
    ax.set_ylabel("Average Sentiment Score")
    ax.tick_params(axis='x', rotation=45)

    buffer = BytesIO()
    fig.savefig(buffer, format='png', bbox_inches='tight')
    buffer.seek(0)
    plt.close(fig)
    return base64.b64encode(buffer.getvalue()).decode('utf-8')


# Word Clouds for Positive and Negative Sentiments
def generate_pos_neg_wordclouds(df, selected_user=None):
    if selected_user and selected_user != "Overall":
        df = df[df["user"] == selected_user]

    positive_words = " ".join(df[df["Sentiment"] == "Positive"]["message"].astype(str))
    negative_words = " ".join(df[df["Sentiment"] == "Negative"]["message"].astype(str))

    wc_pos = WordCloud(width=500, height=500, min_font_size=10, background_color='black')
    wc_neg = WordCloud(width=500, height=500, min_font_size=10, background_color='white')

    img_pos = wc_pos.generate(positive_words)
    img_neg = wc_neg.generate(negative_words)

    return img_pos, img_neg
