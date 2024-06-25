// script.js

const bottomSheet = document.querySelector(".bottom-sheet");
const dragHandle = document.querySelector(".drag-handle");
const scrollToTopButton = document.querySelector(".button");
const diaryButton = document.querySelector('.DiaryButton');

let isDragging = false;
let startY, startBottom;

dragHandle.addEventListener("mousedown", startDragging);
scrollToTopButton.addEventListener("click", scrollToTop);
diaryButton.addEventListener("click", ShowDiary);

function startDragging(e) {
  e.preventDefault();
  isDragging = true;
  startY = e.clientY;
  startBottom = parseInt(getComputedStyle(bottomSheet).bottom);

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDragging);
}

function drag(e) {
  if (!isDragging) return;
  const deltaY = e.clientY - startY;
  if (Math.max(startBottom - deltaY, 0) < 400) {
    bottomSheet.style.bottom = Math.max(startBottom - deltaY, 0) + "px";
  }
}

function stopDragging() {
  isDragging = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDragging);
}

function ShowDiary() {
  getEmotion(userID, searchDate)
  .then((doc) => {
            if (doc.exists) {
              var emotionData = doc.data().emotion;
              document.querySelector("searchResult").innerText =
                `Emotion on ${searchDate}: ${emotionData}`;
            } else {
              document.getElementById("searchResult").innerText =
                `No emotion data found for ${searchDate}`;
            }
          })
          .catch((error) => {
            console.error("Error getting emotion data: ", error);
          });

        // Retrieve diary    a entry
        getDiaryEntry(userID, searchDate)
          .then((doc) => {
            if (doc.exists) {
              var diaryText = doc.data().text;
              document.querySelector(".sSummary").innerText +=
                `${sentDiaryData(authUser, searchDate)}`;
            } else {
              document.querySelector(".sSummary").innerText +=
                `\nNo diary entry found for ${searchDate}`;
            }
          })
}

diarytest();

//把diary資料抓出來
async function sentDiaryData(authUser, selectedDate) {
  console.log("sentDiaryData");
  const userID = authUser.uid;
  console.log("User authenticated:", authUser);
  let processedDiary = [];
  processedDiary.push(userID);

  function formatDate(date) {
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, "0");
      let day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
  }

  try {
      const userRef = db.collection("users").doc(userID);
      const diaryRef = userRef.collection("diary");
      const diarySnapshot = await diaryRef.get();

      let date = new Date(selectedDate);
      date.setDate(date.getDate());
      let formattedDate = formatDate(date);
      console.log("Checking date:", formattedDate);
      let diaryFound = false;

      diarySnapshot.forEach((doc) => {
          if (doc.id == formattedDate) {
              let data = doc.data();
              processedDiary.push(data.text);
              diaryFound = true;
          }
      });

      if (!diaryFound) {
          let default_diary = "no diary";
          processedDiary.push(default_diary);
      }

      return processedDiary;
  } catch (error) {
      console.error("Error getting diary documents: ", error);
  }
}

//格式測試
function diarytest() {
  let diary_input = [];
  firebase.auth().onAuthStateChanged(function (authUser) {
      if (authUser) {
          user = authUser;
          sentDiaryData(user, "2024-06-01")
              .then((result) => {
                  diary_input = result;
                  console.log("diary input:", diary_input);
              })
              .catch((error) => {
                  console.error("Error fetching diary data:", error);
              });
      }
  });
  console.log("really get diary input:", diary_input);
}
