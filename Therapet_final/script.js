function toggleImage() {
  console.log("click image");
  firebase.auth().onAuthStateChanged(function (authUser) {
      if (authUser) {
          user = authUser;
          var userID = user.uid;
          var userRef = db.collection("users").doc(userID);
          userRef
              .get()
              .then((doc) => {
                  if (doc.exists) {
                      const userData = doc.data();
                      const selectedAnimal = userData.selectedAnimal;
                      if (selectedAnimal) {
                          var homePetImage = document.getElementById("homePetImage");
                          homePetImage.src = "image/" + selectedAnimal.toLowerCase() + ".gif";

                          setTimeout(function () {
                            homePetImage.src = "image/" + selectedAnimal.toLowerCase() + ".png";
                          }, 2000);
                      }
                  }
              })
              .catch((error) => {
                  console.log("Error getting document:", error);
              });
      } else {
          user = null;
          console.log("User not authenticated.");
      }
  });
}

$(document).ready(function () {
  console.log("ready");
  var scroll = { block: "start", behavior: "smooth" };
  $(".pb_home").click(function () {
    console.log("home");
    $(".page_home")[0].scrollIntoView(scroll);
  });
  $(".pb_chat").click(function () {
    $(".page_chat")[0].scrollIntoView(scroll);
  });
  $(".pb_diary").click(function () {
    $(".page_diary")[0].scrollIntoView(scroll);
  });
  $("#backhomebtn").click(function () {
    console.log("home");
    $(".page_home")[0].scrollIntoView(scroll);
  });
});

var PageScroll = $(".pages")[0];
var CurPage = 1;
PageScroll.addEventListener("scroll", (event) => {
  CurPage =
    Math.floor(
      ((PageScroll.scrollLeft + 1) * 3) / (PageScroll.scrollWidth - 50),
    ) + 1;
  if (CurPage == 1) {
    //console.log("page1");
    document.getElementById("openbtn").style.display = "block";
    document.getElementById("backhomebtn").style.display = "none";
  } else if (CurPage == 2) {
    //console.log("page2");
    document.getElementById("openbtn").style.display = "none";
    document.getElementById("backhomebtn").style.display = "block";
  } else if (CurPage == 3) {
    //console.log("page3");
    document.getElementById("openbtn").style.display = "block";
    document.getElementById("backhomebtn").style.display = "none";
  } else {
    //console.log("page_else");
  }
  // 莫斯比你可以幫我一個忙ㄇ 在聊天頁切回主頁的時候會卡一下 下面的bar
  // 然後你是要讓sidebar捲起來 而不是疊在上面嗎 因為我怕捲起來會太窄 moodle那樣 會把螢幕擠到右邊
  // 還是先這樣就好(?) 可 我要先暫離一下 請說 你先切聊天 再按左上角回去會卡一下嗎
  // 好！
  // 捲起來是什麼意思?
  //   喔！酷欸
  //   我現在這樣覺得也可以? 想問 卡一下是什麼意思 我好像沒有
  // 你是說它等半秒才出來嗎? 我螢幕錄影放群組好了 好
  // sidebar 的js 可以借我看看嗎 我找不到ww 我框起來 他其實只有改寬度 他的寫再css比較多
  // 我覺得好像是下面的跑出來跟切換的速度不同 我傳群組 就是他的上下bar會卡一下 欸我先去洗澡
  //你那個是要設定成現在選的狗嗎 我可以幫你改 你變數設甚麼 我明天可能不一定會去現場 因為我篩出來很深XD
  //ok! 看到了！ 還有你的狗狗在右邊 我的不一樣 我去看看 是 再問怎麼弄 你先洗澡? 恩恩
  //好久沒遇到有人確診..哭 現在沒有變數 硬設url 等下我 欸欸我欸我找到那隻狗的問題了 是因為他好像有點像absolute但沒有跟容器的大小有關 把他縮窄就可以正常ㄌ
  //我首確 你變數設chatpet嗎 恩恩！我剛剛都是用手機模式測 就沒有遇到問題 我再讓它電腦不會歪掉

  bar_move(CurPage == 2 ? true : false);
});

function bar_move(dir) {
  //console.log("bar move");
  //var target = dir ? "translateY(100%)" : "translateY(0%)";
  //$(".bar")[0].style.transform = target;
}

const openSidebar = () => {
  document.getElementById("mySidebar").style.width = "250px";
  // document.getElementById("main").style.marginLeft = "250px";
};

const closeSidebar = () => {
  document.getElementById("mySidebar").style.width = "0";
  // document.getElementById("main").style.marginLeft = "0";
};
