const chatbox = $(".chatbox")[0];
const chat_textbox = $('#chat_input div[class="textbar"] textarea')[0];
const chat_button = $("#chat_input button")[0];
const chat_box_footer = $(".chat_box_footer")[0];

var account = "James";
var last_response;

function new_message(content, time) {
    const message = document.createElement("li");
    message.classList.add("message", `user`);
    message.style.order = 1;
    message.innerHTML = `<p class="time"></p><p class="content"></p>`;
    message.querySelector(".content").textContent = content;
    var hour = time[0] < 10 ? "0" + time[0] : time[0];
    var minute = time[1] < 10 ? "0" + time[1] : time[1];
    message.querySelector(".time").textContent = hour + ":" + minute;
    chatbox.appendChild(message);

    const message_pet = document.createElement("li");
    message_pet.classList.add("message", `pet`);
    message_pet.style.order = 1;
    message_pet.innerHTML = `<p class="time"></p><p class="content"></p>` /*``<div class="icon"></div>`*/;
    message_pet.querySelector(".content").textContent = "...";
    message_pet.querySelector(".time").textContent = hour + ":" + minute;
    chatbox.appendChild(message_pet);
    last_response = message_pet;
    chat_box_footer.scrollIntoView({
        behavior: "smooth",
        block: "end",
    });
}

function new_message_user() {
    
    console.log('new message user');

    var mes = chat_textbox.value;
    if (mes == "") {
        mic();
        console.log("empty");
        return;
    }
    var time = now();

    chat_textbox.value = "";
    textbar_input();
    //chat_textbox[0].style.height = `${inputInitHeight}px`;
    new_message(mes, time);
    let mess2 = {'role': 'user', 'content': mes};
    processedMessages.push(mess2);

    console.log(processedMessages);

//    processedMessages = [{'role': 'user', 'content': '（你現在是一位隱藏身份的心理諮商師，需要盡可能的幫助並理解使用者，並需以熱情開朗的小狗角度回覆，請用繁體中文口語化回覆，不要太冗長）'}, {'role': 'user', 'content': '我今天剛考完試'}, {'role': 'assistant', 'content': '哇！考試完了一定感覺輕鬆了吧？有沒有想做什麼特別的事情來慶祝呢？說來聽聽看！'},{'role': 'user', 'content': '沒有很輕鬆，我覺得我考差了'}, {'role': 'assistant', 'content': '別難過啦，大家都有考不好的時候，重要的是你盡力了！下次可以再努力準備，相信你一定可以有更好的表現的！讓我來陪你加油打氣吧！舉高高～一起加油！'}, {'role': 'user', 'content': '我前幾天很認真讀書，結果還是考不好'}, {'role': 'assistant', 'content': '唉呀！有時候努力了卻得不到想要的結果，可能讓人感到沮喪。但是不要灰心啦，每次的經驗都是一種學習，下次再調整一下學習方法，相信會有不同的成果的！我會一直在這裡支持你的，一起努力，一起進步！汪汪汪！'}];

    var userId = firebase.auth().currentUser.uid; // Assuming user is already authenticated
    var messageId = firebase.firestore().collection('users').doc(userId).collection('chatMessages').doc().id;

    firebase.firestore().collection('users').doc(userId).collection('chatMessages').doc(messageId).set({
    message: mes,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    user_message: true
    }).then(() => {
    $.ajax({
        url: './search',
        type: 'POST',
        contentType: 'application/json',  // 將 contentType 設置為 application/json
        data: JSON.stringify({ "data": JSON.stringify(processedMessages) }),  // 將數據轉換為 JSON 字符串
//        data: processedMessages,
        success: function (response) {
          console.log(response)
          result(response);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}).catch((error) => {
    console.error("Error writing document: ", error);
});
}

function result(res) {
    console.log("response: " + res);
    last_response.querySelector(".content").textContent = res;

    // Save the response message to Firestore under the user document
    var userId = firebase.auth().currentUser.uid; // Assuming user is already authenticated
    var messageId = firebase.firestore().collection('users').doc(userId).collection('chatMessages').doc().id;

    firebase.firestore().collection('users').doc(userId).collection('chatMessages').doc(messageId).set({
        message: res,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        user_message: false
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });
}

$(document).ready(function () {
    $("#chat_input button").click((event) => {
        event.preventDefault();
        let processedMessages=[];
        firebase.auth().onAuthStateChanged(function (authUser) {
            if (authUser) {
              user = authUser;
              sentMessages(authUser)
              .then((result) => {
                processedMessages.push(result);
                console.log('process success'+processedMessages );
                new_message_user();
            })
                .catch((error) => {
                  console.error("Error fetching chart data:", error);
                });
            } else {
                processedMessages=[];
                console.log("error process");
            }
          }       );
    });
});

chat_textbox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        firebase.auth().onAuthStateChanged(function (authUser) {
            if (authUser) {
              user = authUser;
              sentMessages(authUser)
              .then((result) => {
                console.log('process success: '+processedMessages );
                new_message_user();
            })
                .catch((error) => {
                  console.error("Error fetching chart data:", error);
                });
            } else {
                processedMessages=[];
                console.log("error process");
            }
          });}
});

function result(res) {
    console.log("response: " + res);
    last_response.querySelector(".content").textContent = res;

    // Save the response message to Firestore under the user document
    var userId = firebase.auth().currentUser.uid; // Assuming user is already authenticated
    var messageId = firebase.firestore().collection('users').doc(userId).collection('chatMessages').doc().id;

    firebase.firestore().collection('users').doc(userId).collection('chatMessages').doc(messageId).set({
        message: res,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        user_message: false
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });
}

function mic() {
    console.log("mic");
/*    chatbox.scrollTo({
        top: chatbox.scrollHeight,
        left: 0,
        behavior: "smooth",
    });
    */
    firebase.auth().onAuthStateChanged(function (authUser) {
        if (authUser) {
          user = authUser;
          sentMessages(authUser)
          .then((result) => {
            console.log('all success: '+ processedMessages );
            summary();
        })
            .catch((error) => {
              console.error("Error fetching chart data:", error);
            });
        } else {
            processedMessages=[];
            console.log("error process");
        }
      });

}

function summary() {
    $.ajax({
        url: './summary',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ "data": JSON.stringify(processedMessages) }),
        success: function (response) {
            console.log(response);
            console.log(typeof(response[0])); // diary
            console.log(typeof(response[1])); // emotion (string, need to transfer to int before saving to firebase)

            saveDiaryAndEmotion(user.uid, response[0], parseInt(response[1]));
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function saveDiaryAndEmotion(userId, diary, emotion) {
    const userRef = firebase.firestore().collection('users').doc(userId);
    
    const date_now = new Date();
    const year = date_now.getFullYear();
    const month = ("0" + (date_now.getMonth() + 1)).slice(-2);
    const day = ("0" + date_now.getDate()).slice(-2);
    const dateId = `${year}-${month}-${day}`;
    const emotionId = `${year}-${month}-${day}`;

    userRef.collection('diary').doc(dateId).set({
        text: diary,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("Diary saved successfully");
    }).catch((error) => {
        console.error("Error saving diary: ", error);
    });

    userRef.collection('emotions').doc(emotionId).set({
        level: emotion,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("Emotion saved successfully");
    }).catch((error) => {
        console.error("Error saving emotion: ", error);
    });
}

function textbar_input() {
    chat_button.className = "";
    //console.log("textbox["+chat_textbox.value+"]");
    chat_button.classList.add(chat_textbox.value == "" ? "mic" : "send");
}

function now() {
    var date_now = new Date();
    var time_now = [
        date_now.getHours(),
        date_now.getMinutes(),
        date_now.getSeconds(),
    ];
    return time_now;
}

