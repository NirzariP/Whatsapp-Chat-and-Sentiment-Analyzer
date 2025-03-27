from flask import Flask, render_template, request, jsonify
from preprocessor import preprocess
from helper import fetch_stats, most_busy_users, create_wordcloud, most_common_words, emoji_count, monthly_timeline
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from io import BytesIO
import base64


app = Flask(__name__)
dataframe = None

@app.route('/')
def home():
    return render_template('home.html')

# Whatsapp Chat Data Analysis
@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    global dataframe
    user_list = []
    show_analysis = False
    if request.method == 'POST':
        file = request.files['file']
        if file:
            file_contents = file.read().decode('utf-8')
            dataframe = preprocess(file_contents)
            user_list = dataframe['user'].unique().tolist()
            user_list.remove('group notification')
            user_list.sort()
            user_list.insert(0, "Overall")
            show_analysis = True
    dataframe_dict = dataframe.to_dict(orient='records') if dataframe is not None else None
    return render_template('upload.html', dataframe=dataframe_dict, user_list=user_list, show_analysis=show_analysis)


@app.route('/fetch_stats', methods=['POST'])
def fetch_stats_route():
    global dataframe
    selected_user = request.json.get('selected_user')
    result = fetch_stats(selected_user, dataframe)
    return jsonify(result)

@app.route('/most_busy_users', methods=['POST'])
def most_busy_users_route():
    global dataframe
    selected_user = request.json.get('selected_user')
    if selected_user == 'Overall':
        x, y = most_busy_users(dataframe)
        fig, ax = plt.subplots()
        ax.bar(x.index, x.values)
        # Save the figure to a BytesIO object
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        # Encode the image as base64
        image_mostbusyusers = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close(fig)
        return jsonify(image_mostbusyusers=image_mostbusyusers, y=y.to_dict(orient='records'))
    else:
        return jsonify(message="No graph available for selected user")


@app.route('/create_wordcloud', methods=['POST'])
def create_wordcloud_route():
    global dataframe
    selected_user = request.json.get('selected_user')
    df_wc = create_wordcloud(selected_user, dataframe)
    fig, ax = plt.subplots()
    ax.imshow(df_wc)
    # Save the figure to a BytesIO object
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    # Encode the image as base64
    image_wordcloud = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close(fig)
    return jsonify(image_wordcloud=image_wordcloud)
    

@app.route('/most_common_words', methods=['POST'])
def get_most_common_words():
    global dataframe
    selected_user = request.json.get('selected_user')
    most_common_df = most_common_words(selected_user, dataframe)
    return jsonify(most_common_df=most_common_df.to_dict(orient='records'))


@app.route('/emoji_count', methods=['POST'])
def get_emoji():
    global dataframe
    selected_user = request.json.get('selected_user')
    emoji_df = emoji_count(selected_user, dataframe)
    emojis = emoji_df[0].tolist()
    frequencies = emoji_df[1].tolist()
    fig, ax = plt.subplots()
    ax.bar(emojis, frequencies)
    ax.set_xlabel('Emoji')
    ax.set_ylabel('Frequency')
    ax.set_title('Emoji Usage')
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_emoji = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close(fig)
    return jsonify(image_emoji=image_emoji)

@app.route('/monthly_timeline', methods=['POST'])
def month_timeline():
    global dataframe
    selected_user = request.json.get('selected_user')
    timeline = monthly_timeline(selected_user, dataframe)
    fig, ax = plt.subplots()
    ax.plot(timeline['time'], timeline['message'])
    ax.tick_params(axis='x', rotation=90)
    ax.set_xlabel('Timeline')
    ax.set_ylabel('Messages')
    ax.set_title('Timeline for Messages')
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_timeline = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close(fig)
    return jsonify(image_timeline=image_timeline)

# Whatsapp Chat Sentiment Analysis
@app.route('/sentiment', methods=['GET', 'POST'])
def sentiment_analysis_file():
    return render_template('sentiment.html')

if __name__ == '__main__':
    app.run(debug=True)