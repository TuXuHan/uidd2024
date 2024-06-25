$(document).ready(function () {
  $(".sSummary")[0].disabled = true;
  $(".sEdit").click((event) => {
    event.preventDefault();
    Edit();
  });
  $(".sEmo").click((event) => {
    event.preventDefault();
    if (event.target.classList[1][4] != "S") {
      EmotionSet(Number(event.target.classList[1][4]));
    }
    // $(".sSummary")[0].value="finnalyy";
  });
  $(".sSave").click((event) => {
    event.preventDefault();
    $(".sSummary")[0].disabled = disable = true;
    console.log(
      "Save: emo" + currentEmotion + ", sum" + $(".sSummary")[0].value,
    );
    black.style.display = "none";
  });
  for (var i = 1; i < 6; i++) {
    var name = ".sEmoSel" + i;
    $(name)[0].style.display = "none";
  }
  black.style.display = "none";
});

$(".DiaryButton")[0].addEventListener("click", function () {
  var userID = user.uid;
  var date = $(".DiaryButton")[0].classList[1];
  black.style.display = "flex";
  console.log("hi");
  console.log(diarycontent);
  setSummary(diarycontent);
  currentEmotion = emotionnum;
  console.log(currentEmotion);
  if (currentEmotion != 0) {
    var Name = ".sEmoSel" + currentEmotion;
    $(Name)[0].style.display = "block";
  }
});

var disable = true;
function Edit() {
  if (disable) {
    $(".sSummary")[0].disabled = disable = false;
    $(".sSummary")[0].style.borderColor = "#aaa";
  } else {
    $(".sSummary")[0].disabled = disable = true;
    $(".sSummary")[0].style.borderColor = "transparent";
    //save changes
  }
}

var currentEmotion = 0;
function EmotionSet(newEmotion) {
  if (currentEmotion != newEmotion) {
    if (currentEmotion != 0) {
      var CurName = ".sEmoSel" + currentEmotion;
      $(CurName)[0].style.display = "none";
    }
    var NewName = ".sEmoSel" + newEmotion;
    $(NewName)[0].style.display = "block";
    currentEmotion = newEmotion;
    console.log("set emotion:" + newEmotion); //1 to 5
  }
}

const hideButton = document.querySelector(".test");
const black = document.querySelector(".black");

hideButton.addEventListener("click", function () {
  if (black.style.display === "none") {
    black.style.display = "flex";
  } else {
    black.style.display = "none";
  }
});

function setSummary(text) {
  console.log("setsummm"+diarycontent);
  document.querySelector(".sSummary").value = diarycontent;
}
