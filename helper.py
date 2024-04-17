from urlextract import URLExtract
extractor = URLExtract()
from wordcloud import WordCloud
from collections import Counter
import pandas as pd
import emoji


def fetch_stats(selected_user, dataframe):
    words = []
    if selected_user != 'Overall':
        dataframe = dataframe[dataframe['user'] == selected_user]
    total_messages = dataframe.shape[0]
    for message in dataframe['message']:
        words.extend(message.split())
    total_words = len(words)
    media_shared = dataframe[dataframe['message'] == '<Media omitted>\n'].shape[0] 
    links = []
    for message in dataframe['message']:
        links.extend(extractor.find_urls(message))
    total_links = len(links)
    return {
        'total_messages': total_messages,
        'total_words': total_words,
        'media_shared': media_shared,
        'total_links': total_links
    }


def most_busy_users(dataframe):
    x = dataframe['user'].value_counts().head()
    y = round((dataframe['user'].value_counts().head() / dataframe.shape[0]) * 100, 2).reset_index().rename(columns = {'index':'User Name', 'user': 'Active Percentage'})
    return x, y


def create_wordcloud(selected_user, dataframe):
    f = open('stop_hinglish.txt','r')
    stop_words = f.read()   
    if selected_user != 'Overall':
        dataframe = dataframe[dataframe['user'] == selected_user]
    temp = dataframe[dataframe['user'] != 'group notification']
    temp = temp[temp['message'] != '<Media omitted>\n'] 
    def remove_stop_words(message):
        y = []
        for word in message.lower().split():
            if word not in stop_words:
                y.append(word)
        return " ".join(y)
    wc = WordCloud(width = 500, height=500, min_font_size=10, background_color='black')
    temp['message'] = temp['message'].apply(remove_stop_words)
    df_wc = wc.generate(temp['message'].str.cat(sep = " "))
    return df_wc


def most_common_words(selected_user, dataframe):
    f = open('stop_hinglish.txt','r')
    stop_words = f.read()   
    if selected_user != 'Overall':
        dataframe = dataframe[dataframe['user'] == selected_user]
    temp = dataframe[dataframe['user'] != 'group notification']
    temp = temp[temp['message'] != '<Media omitted>\n'] 
    words = []
    for message in temp['message']:
        for word in message.lower().split():
            if word not in stop_words:
                words.append(word)
    most_common_df = pd.DataFrame(Counter(words).most_common(20))
    return most_common_df    


def emoji_count(selected_user, dataframe):
    if selected_user != 'Overall':
        dataframe = dataframe[dataframe['user'] == selected_user]
    emojis = []
    for message in dataframe['message']:    
        emojis.extend([e['emoji'] for e in emoji.emoji_list(message)])
    emoji_df = pd.DataFrame(Counter(emojis).most_common(len(Counter(emojis)))).head()
    return emoji_df

def monthly_timeline(selected_user, dataframe):
    if selected_user != 'Overall':
        dataframe = dataframe[dataframe['user'] == selected_user]
    timeline = dataframe.groupby(['year', 'month_num', 'month']).count()['message'].reset_index()
    time = []
    for i in range(timeline.shape[0]):
        time.append(timeline['month'][i] + "-" + str(timeline['year'][i]))
    timeline['time'] = time
    return timeline
