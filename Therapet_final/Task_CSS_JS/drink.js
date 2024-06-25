
  let customClickCount = 0;
  const customTotalImages = 7; // 圖片總數

  function openCustomPopup() {
    let popupElements = document.getElementsByClassName('popup');
    if (popupElements.length > 0) {
        let popupElement = popupElements[0];
        popupElement.style.display = 'none';
    }
    document.getElementById('customImagePopup').style.display = "block";
  }

  function closeCustomPopup() {
    document.getElementById('customImagePopup').style.display = "none";
  }

  function changeCustomImage() {
    if (customClickCount < customTotalImages - 1) {
      customClickCount++;
      document.getElementById('customDynamicImage').src = './drink_img/cup/' + customClickCount + '.png';
    }
  }
