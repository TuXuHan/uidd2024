let countdownTimer;
let imageTimer;
let currentImageIndex = 0;
const totalImages = 4; // 圖片總數
const imageDuration = 10; // 每張圖片顯示的秒數

function startCountdown(duration) {
    let timer = duration, minutes, seconds;
    countdownTimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('countdown').textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdownTimer);
            clearInterval(imageTimer);
            closeCountdown();
        }
    }, 1000);
}

// /Home/Task_CSS_JS/breath_img/0.png
// /Task_CSS_JS/breath_img/0.png
function startImageRotation() {
    imageTimer = setInterval(function () {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        document.getElementById('dynamicImage').src = './breath_img/' + currentImageIndex + '.png';
        if (currentImageIndex%2 == 0) {
            document.getElementById('hale').textContent = "Exhale";
        }
        else{
            document.getElementById('hale').textContent = "Inhale";
        }
    }, imageDuration * 1000);
}

function openCountdown() {
    let popupElements = document.getElementsByClassName('popup');
    if (popupElements.length > 0) {
        let popupElement = popupElements[0];
        popupElement.style.display = 'none';
    }
    document.getElementById('countdownModal').style.display = "block";
    startCountdown(60); // 1分鐘
    startImageRotation();
}

function closeCountdown() {
    document.getElementById('countdownModal').style.display = "none";
    clearInterval(countdownTimer);
    clearInterval(imageTimer);
}

window.onclick = function(event) {
    if (event.target == document.getElementById('countdownModal')) {
        closeCountdown();
    }
}