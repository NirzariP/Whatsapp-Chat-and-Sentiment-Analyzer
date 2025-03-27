$(document).ready(function() {
    console.log("jQuery Loaded");

    $("#showAnalysisBtn").click(function() {
        console.log("Button Clicked");
        var selected_user = document.getElementById("userDropdown").value;
        console.log("Selected User:", selected_user);
        fetch('/fetch_stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selected_user: selected_user }),
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("totalMessages").innerText = data.total_messages;
            document.getElementById("totalWords").innerText = data.total_words;
            document.getElementById("mediaShared").innerText = data.media_shared;
            document.getElementById("totalLinks").innerText = data.total_links;

            // Most Busy Users
            if (selected_user !== 'Overall') {
                var oldGraph = document.getElementById("mostBusyUsersGraph");
                if (oldGraph) {
                    oldGraph.parentNode.removeChild(oldGraph);
                }
                var oldYTable = document.getElementById("yDataTable");
                if (oldYTable) {
                    oldYTable.parentNode.removeChild(oldYTable);
                }
            }
            if (selected_user === 'Overall') {
                fetch('/most_busy_users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ selected_user: selected_user }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.image_mostbusyusers) {
                        var img_mostbusyusers = new Image();
                        img_mostbusyusers.src = 'data:image/png;base64,' + data.image_mostbusyusers;
                        img_mostbusyusers.id = "mostBusyUsersGraph";
                        var graphContainer = document.createElement("div");
                        graphContainer.className = "col-sm-6";
                        graphContainer.appendChild(img_mostbusyusers);
                        // document.getElementById("resultContainer").appendChild(graphContainer);
                        document.getElementById("mostBusyUsersContainer").innerHTML = ""; // Clear old content
                        document.getElementById("mostBusyUsersContainer").appendChild(img_mostbusyusers);

                        var yData = data.y;
                        var yContainer = document.createElement("div");
                        yContainer.id = "yDataTable";
                        yContainer.className = "col-sm-6";
                        var yTable = document.createElement("table");
                        yTable.className = "table";
                        var tableBody = document.createElement("tbody");
                        yTable.appendChild(tableBody);
                        yData.forEach(row => {
                            var tr = document.createElement("tr");
                            Object.values(row).forEach(value => {
                                var td = document.createElement("td");
                                td.innerText = value;
                                tr.appendChild(td);
                            });
                            tableBody.appendChild(tr);
                        });
                        yContainer.appendChild(yTable);
                        // document.getElementById("resultContainer").appendChild(yContainer);
                        document.getElementById("mostBusyUsersContainer").innerHTML = ""; // Clear old content
                        document.getElementById("mostBusyUsersContainer").appendChild(yContainer);
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error("Error fetching stats:", error);
                    alert("An error occurred while fetching stats");
                });
            }


            // Most Common User
            fetch('/most_common_words', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selected_user: selected_user }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                var oldMostCommonTable = document.getElementById("mostCommonTable");
                if (oldMostCommonTable) {
                    oldMostCommonTable.parentNode.removeChild(oldMostCommonTable);
                }
                var mostCommonContainer = document.createElement("div");
                mostCommonContainer.id = "mostCommonTable";
                mostCommonContainer.className = "col-sm-12";
                var mostCommonTable = document.createElement("table");
                mostCommonTable.className = "table";
                var mostCommonTableBody = document.createElement("tbody");
                mostCommonTable.appendChild(mostCommonTableBody);
                data.most_common_df.forEach(row => {
                    var tr = document.createElement("tr");
                    var word = document.createElement("td");
                    var count = document.createElement("td");
                    word.innerText = row[0];
                    count.innerText = row[1];
                    tr.appendChild(word);
                    tr.appendChild(count);
                    mostCommonTableBody.appendChild(tr);
                });
                mostCommonContainer.appendChild(mostCommonTable);
                // document.getElementById("resultContainer").appendChild(mostCommonContainer);
                document.getElementById("mostCommonWordsContainer").innerHTML = ""; // Clear old content
                document.getElementById("mostCommonWordsContainer").appendChild(mostCommonTable);


                // Word Cloud
                var oldWordCloud = document.getElementById("wordCloudImage");
                if (oldWordCloud) {
                    oldWordCloud.parentNode.removeChild(oldWordCloud);
                }
                fetch('/create_wordcloud', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ selected_user: selected_user }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.image_wordcloud) {
                        var img_wordcloud = new Image();
                        img_wordcloud.src = 'data:image/png;base64,' + data.image_wordcloud;
                        img_wordcloud.id = "wordCloudImage"; // Set the id of the image element
                        var wordCloudContainer = document.createElement("div");
                        wordCloudContainer.className = "col-sm-12";
                        wordCloudContainer.appendChild(img_wordcloud);
                        // document.getElementById("resultContainer").appendChild(wordCloudContainer);
                        document.getElementById("wordCloudContainer").innerHTML = ""; // Clear old content
                        document.getElementById("wordCloudContainer").appendChild(img_wordcloud);
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error("Error fetching word cloud:", error);
                    alert("An error occurred while fetching word cloud");
                });



                // Emoji Graph 
                var oldEmojiGraph = document.getElementById("emojiGraph");
                if (oldEmojiGraph) {
                    oldEmojiGraph.parentNode.removeChild(oldEmojiGraph);
                }

                fetch('/emoji_count', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ selected_user: selected_user }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.image_emoji) {
                        var img_emoji = new Image();
                        img_emoji.src = 'data:image/png;base64,' + data.image_emoji;
                        img_emoji.id = "emojiGraph";
                        var emojiGraphContainer = document.createElement("div");
                        emojiGraphContainer.className = "col-sm-12";
                        emojiGraphContainer.appendChild(img_emoji);
                        // document.getElementById("resultContainer").appendChild(emojiGraphContainer);
                        document.getElementById("emojiGraphContainer").innerHTML = ""; // Clear old content
                        document.getElementById("emojiGraphContainer").appendChild(img_emoji);
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error("Error fetching emoji graph:", error);
                    alert("An error occurred while fetching emoji graph");
                });



                // Timeline Graph
                var oldTimelineGraph = document.getElementById("timelineGraph");
                if (oldTimelineGraph) {
                    oldTimelineGraph.parentNode.removeChild(oldTimelineGraph);
                }
                fetch('/monthly_timeline', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ selected_user: selected_user }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.image_timeline) {
                        var img_timeline = new Image();
                        img_timeline.src = 'data:image/png;base64,' + data.image_timeline;
                        img_timeline.id = "timelineGraph";
                        var timelineGraphContainer = document.createElement("div");
                        timelineGraphContainer.className = "col-sm-12";
                        timelineGraphContainer.appendChild(img_timeline);
                        // document.getElementById("resultContainer").appendChild(timelineGraphContainer);
                        document.getElementById("timelineGraphContainer").innerHTML = ""; // Clear old content
                        document.getElementById("timelineGraphContainer").appendChild(img_timeline);
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error("Error fetching timeline graph:", error);
                    alert("An error occurred while timeline emoji graph");
                });


            })
            .catch(error => {
                console.error("Error fetching most common words:", error);
                alert("An error occurred while fetching most common words");
            });


        })
        .catch(error => {
            console.error("Error fetching stats:", error);
            document.getElementById("totalMessages").innerText = "Error";
            document.getElementById("totalWords").innerText = "Error";
            document.getElementById("mediaShared").innerText = "Error";
            document.getElementById("totalLinks").innerText = "Error";
        });
    });
});


// Result Container Only visible after clicking showAnalysisBtn Button
document.addEventListener("DOMContentLoaded", function () {
    const showAnalysisBtn = document.getElementById("showAnalysisBtn");
    const resultContainer = document.querySelector(".result");

    showAnalysisBtn.addEventListener("click", function () {
        resultContainer.style.display = "flex"; // Show the result container
    });
});
