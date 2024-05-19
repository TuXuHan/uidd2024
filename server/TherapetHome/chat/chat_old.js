
const chatbox = $(".chatbox")[0];
const chat_textbox = $('#chat_input div[class="textbar"] textarea')[0];

var account = "James";

$("#button2").click(function() { new_message("Hey", "pet"); });
$("#button3").click(function() { new_message("Umm", "user"); });

function new_message(content, className) {
  const message = document.createElement("li");
  message.classList.add("message", `${className}`);
  message.innerHTML = `<p class="content"></p>`;
  message.querySelector("p").textContent = content;
  chatbox.appendChild(message);
  chatbox.scrollTo({ top: chatbox.scrollHeight, left: 0, behavior: "smooth", });

};

function new_message_user() {
  var mes = chat_textbox.value;
  if (mes == "") { return; }

  chat_textbox.value = "";
  //chat_textbox[0].style.height = `${inputInitHeight}px`;
  new_message(mes, "user");
  $.get('/chat_input', {
    message: mes,
    user: account,
    time: now(),
  }
    , (res) => {
      result(res);
    });
}

function result(res) {
  console.log("response: " + res);
  new_message(res, "pet");
}


$(document).ready(function() {
  $('#chat_input .send').click((event) => {
    event.preventDefault();
    new_message_user();

  });
  $('#chat_input .mic').click((event) => {
    event.preventDefault();
    console.log("mic pressed");
  });
});

chat_textbox.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    new_message_user();
  }
});

function now() {
  var date_now = new Date();
  var time_now = [date_now.getHours(), date_now.getMinutes(), date_now.getSeconds()];
  return time_now;
}
