$(document).ready(function () {
    console.log("jQuery Loaded - Sentiment Analysis");

    $("#analyzeSentimentBtn").click(function () {
        console.log("Button Clicked");
        var selected_user = document.getElementById("userDropdown").value;
        console.log("Selected User for Sentiment Analysis:", selected_user);

        // --- Time-Based Sentiment Trend ---
        fetch('/sentiment_trend_time', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selected_user: selected_user }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.image_sentiment_time) {
                console.log("Hit");
                const img_time = new Image();
                img_time.src = 'data:image/png;base64,' + data.image_sentiment_time;
                img_time.id = "sentimentTimeGraph";
                const container = document.getElementById("sentimentTimeContainer");
                container.innerHTML = "";
                container.appendChild(img_time);
            }
        })
        .catch(error => {
            console.error("Error fetching time sentiment:", error);
        });

        // --- User-Specific Sentiment ---
        fetch('/sentiment_trend_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selected_user: selected_user }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.image_sentiment_user) {
                const img_user = new Image();
                img_user.src = 'data:image/png;base64,' + data.image_sentiment_user;
                img_user.id = "sentimentUserGraph";
                const container = document.getElementById("sentimentUserContainer");
                container.innerHTML = "";
                container.appendChild(img_user);
            }
        })
        .catch(error => {
            console.error("Error fetching user sentiment:", error);
        });

        // --- Word Cloud for Sentiments ---
        fetch('/sentiment_wordcloud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selected_user: selected_user }),
        })
        .then(response => response.json())
        .then(data => {
            // Clear old content
            document.getElementById("wordCloudContainer").innerHTML = "";
        
            if (data.pos_image_wordcloud && data.neg_image_wordcloud) {
                var img_pos = new Image();
                img_pos.src = 'data:image/png;base64,' + data.pos_image_wordcloud;
                img_pos.className = "img-fluid mb-3";
                img_pos.alt = "Positive Word Cloud";
        
                var img_neg = new Image();
                img_neg.src = 'data:image/png;base64,' + data.neg_image_wordcloud;
                img_neg.className = "img-fluid";
                img_neg.alt = "Negative Word Cloud";
        
                // Optional: Label headers
                var label1 = document.createElement("h5");
                label1.textContent = "Positive Word Cloud";
                var label2 = document.createElement("h5");
                label2.textContent = "Negative Word Cloud";
        
                var container = document.getElementById("wordCloudContainer");
                container.appendChild(label1);
                container.appendChild(img_pos);
                container.appendChild(label2);
                container.appendChild(img_neg);
            } else {
                alert(data.message || "No word cloud available");
            }
        })
        .catch(error => {
            console.error("Error fetching sentiment word clouds:", error);
            alert("An error occurred while fetching word clouds");
        });                
    });
});