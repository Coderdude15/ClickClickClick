let AddBtn = document.getElementById("AddBtn");
let XBtn = document.getElementById("XBtn");
let CountText = document.getElementById("Count");
let CurrentScoreCount = document.getElementById("CurrentScoreCounter");
let HighScoreCount = document.getElementById("HighScoreCounter");
let XSound = document.getElementById("multiplySound");
let bgMusic = document.getElementById("bgMusic");

XBtn.style.display = "none";

let Count = 0;
let CurrentScore = 0;
let HighScore = 0;

window.addEventListener("load", () => {
  const cameFromNav = localStorage.getItem("navigating") === "true";

  if (cameFromNav) {
    // Don't reset — just continue score
    CurrentScore = parseInt(localStorage.getItem("CurrentScore")) || 0;
    Count = CurrentScore;
  } else {
    // Reset on full reload
    CurrentScore = 0;
    Count = 0;
    localStorage.setItem("CurrentScore", 0);
  }

  localStorage.removeItem("navigating"); // Reset flag
  CountText.innerText = Count;
  CurrentScoreCount.innerText = CurrentScore;

  HighScore = parseInt(localStorage.getItem("HighScore")) || 0;
  HighScoreCount.innerText = HighScore;

  // Apply background if any
  const bg = localStorage.getItem("selectedBackground");
  if (bg && bg !== "none") {
    document.body.style.backgroundImage = bg;
  } else {
    // fallback background
    document.body.style.backgroundImage = "url('https://cdn.wallpapersafari.com/56/21/bLkiQv.jpg')";
  }
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";

});


function saveScore() {
  localStorage.setItem("CurrentScore", CurrentScore);
}

function updateHighScore() {
  if (CurrentScore > HighScore) {
    HighScore = CurrentScore;
    localStorage.setItem("HighScore", HighScore);
  }
  HighScoreCount.innerText = HighScore;
}

function Add() {
  Count += 2;
  CountText.innerText = Count;
  CurrentScore += 2;
  CurrentScoreCount.innerText = CurrentScore;
  saveScore();
  updateHighScore();
}

function X() {
  Count *= 1.2;
  Count = Math.floor(Count);
  CurrentScore = Math.floor(CurrentScore * 1.2);
  CountText.innerText = Count;
  CurrentScoreCount.innerText = CurrentScore;
  saveScore();
  updateHighScore();
}

// Background music toggle
let isMusicPlaying = false;
document.addEventListener("click", () => bgMusic.play().catch(() => {}), { once: true });

function toggleMusic() {
  isMusicPlaying ? bgMusic.pause() : bgMusic.play();
  isMusicPlaying = !isMusicPlaying;
}

// Multiply timer system
const timerDisplay = document.getElementById("multiplyTimer");
const multiplySound = document.getElementById("multiplySound");

function getRandomMinutesInMs(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min) * 60 * 1000;
}
function getRandomSecondsInMs(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min) * 1000;
}
function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  return `${Math.floor(totalSec / 60)}m ${String(totalSec % 60).padStart(2, "0")}s`;
}

function scheduleMultiplyButton() {
  const delay = getRandomMinutesInMs(5, 10);
  let remaining = delay;

  const countdown = setInterval(() => {
    remaining -= 1000;
    if (remaining <= 0) clearInterval(countdown);
    else timerDisplay.textContent = `Multiply in: ${formatTime(remaining)}`;
  }, 1000);

  setTimeout(() => {
    XBtn.style.display = "inline-block";
    clearInterval(countdown);
    timerDisplay.textContent = "Multiply available!";
    multiplySound.play().catch(() => {});

    const visibleDuration = getRandomSecondsInMs(5, 8);
    setTimeout(() => {
      XBtn.style.display = "none";
      scheduleMultiplyButton();
    }, visibleDuration);
  }, delay);
}
scheduleMultiplyButton();

