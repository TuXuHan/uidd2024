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
    $.ajax({
        url: './search',
        type: 'POST',
        contentType: 'application/json',  // 將 contentType 設置為 application/json
        data: JSON.stringify({ "data": mes }),  // 將數據轉換為 JSON 字符串
        success: function (response) {
          console.log(response)
          result(response);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function result(res) {
    console.log("response: " + res);
    last_response.querySelector(".content").textContent = res;
}

$(document).ready(function () {
    $("#chat_input button").click((event) => {
        event.preventDefault();
        new_message_user();
    });
});

chat_textbox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        new_message_user();
    }
});

function mic() {
    console.log("mic");
    chatbox.scrollTo({
        top: chatbox.scrollHeight,
        left: 0,
        behavior: "smooth",
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
