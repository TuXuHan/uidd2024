// script.js

const bottomSheet = document.querySelector(".bottom-sheet");
const dragHandle = document.querySelector(".drag-handle");
const scrollToTopButton = document.querySelector(".button");

let isDragging = false;
let startY, startBottom;

dragHandle.addEventListener("mousedown", startDragging);
scrollToTopButton.addEventListener("click", scrollToTop);

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
