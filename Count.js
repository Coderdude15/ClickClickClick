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
    CurrentScore = parseInt(localStorage.getItem("CurrentScore")) || 0;
    Count = CurrentScore;
  } else {
    CurrentScore = 0;
    Count = 0;
    localStorage.setItem("CurrentScore", 0);
    localStorage.setItem("lastRewardScore", "0");
  }
  localStorage.removeItem("navigating");
  CountText.innerText = Count;
  CurrentScoreCount.innerText = CurrentScore;
  HighScore = parseInt(localStorage.getItem("HighScore")) || 0;
  HighScoreCount.innerText = HighScore;

  const bg = localStorage.getItem("selectedBackground");
  if (bg && bg !== "none") document.body.style.backgroundImage = bg;
  else document.body.style.backgroundImage = "url('https://cdn.wallpapersafari.com/56/21/bLkiQv.jpg')";
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

function checkMilestones() {
  let lastReward = parseInt(localStorage.getItem("lastRewardScore")) || 0;
  const milestoneStep = 50000000;
  while (CurrentScore >= lastReward + milestoneStep) {
    lastReward += milestoneStep;
    CurrentScore += 500;
    Count += 500;
    let shopPoints = parseInt(localStorage.getItem("gameScore")) || 0;
    shopPoints += 500;
    localStorage.setItem("gameScore", shopPoints);
  }
  localStorage.setItem("lastRewardScore", lastReward);
  CountText.innerText = Count;
  CurrentScoreCount.innerText = CurrentScore;
  saveScore();
  updateHighScore();
}

function Add() {
  let clickAmount = 20000000; // base clicks

  const bonusAmount = parseInt(sessionStorage.getItem("clickBonusAmount")) || 0;
  const bonusExpiration = parseInt(sessionStorage.getItem("clickBonusExpiration")) || 0;

  if (bonusAmount > 0 && (bonusExpiration === 0 || Date.now() < bonusExpiration)) {
    clickAmount += bonusAmount;
  } else if (bonusAmount > 0 && Date.now() >= bonusExpiration) {
    alert("⏰ Your click bonus expired!");
    sessionStorage.removeItem("clickBonusAmount");
    sessionStorage.removeItem("clickBonusExpiration");
  }

  Count += clickAmount;
  CurrentScore += clickAmount;
  CountText.innerText = Count;
  CurrentScoreCount.innerText = CurrentScore;

  saveScore();
  updateHighScore();
  checkMilestones();
}


function X() {
  Count = Math.floor(Count * 1.2);
  CurrentScore = Math.floor(CurrentScore * 1.2);
  CountText.innerText = Count;
  CurrentScoreCount.innerText = CurrentScore;
  saveScore();
  updateHighScore();
  checkMilestones();
}

function startAutoClicker() {
  let clicksPerSecond = 52876;
  const duration = 15000;
  const baseAdd = 5287;

  alert("🤖 Auto Clicker activated for 15 seconds!");

  const interval = setInterval(() => {
    Count += baseAdd;
    CurrentScore += baseAdd;
    CountText.innerText = Count;
    CurrentScoreCount.innerText = CurrentScore;
    saveScore();
    updateHighScore();
    checkMilestones();
  }, 1000 / clicksPerSecond);

  setTimeout(() => {
    clearInterval(interval);
    alert("🕓 Auto Clicker expired!");
  }, duration);
}

window.addEventListener("load", () => {
  const autoClickerPending = localStorage.getItem("autoClickerPending") === "true";
  if (autoClickerPending) {
    localStorage.removeItem("autoClickerPending");
    startAutoClicker();
  }
});

let isMusicPlaying = false;
document.addEventListener("click", () => bgMusic.play().catch(() => {}), { once: true });

function toggleMusic() {
  isMusicPlaying ? bgMusic.pause() : bgMusic.play();
  isMusicPlaying = !isMusicPlaying;
}

// ✅ FIXED BUY CLICK BONUS (session-only)
function buyClickBonus(amount, durationMs, cost) {
  if (CurrentScore >= cost) {
    CurrentScore -= cost;
    CountText.innerText = Count;
    CurrentScoreCount.innerText = CurrentScore;

    // Store the bonus only in sessionStorage (clears on refresh/close)
    sessionStorage.setItem("clickBonusAmount", amount);
    sessionStorage.setItem("clickBonusExpiration", Date.now() + durationMs);

    alert(`Bonus +${amount} clicks per press activated for ${durationMs / 1000}s!`);
  } else {
    alert("Not enough points!");
  }

  saveScore();
}

// --- Multiply Timer System ---
const timerDisplay = document.getElementById("multiplyTimer");
const multiplySound = document.getElementById("multiplySound");

function getRandomMinutes(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}m ${sec.toString().padStart(2, "0")}s`;
}

function scheduleMultiplyButton() {
  const minutesDelay = getRandomMinutes(5, 10);
  const delayMs = minutesDelay * 60 * 1000;
  let remaining = delayMs;

  const countdown = setInterval(() => {
    if (remaining <= 0) {
      clearInterval(countdown);
    } else {
      timerDisplay.textContent = `Multiply in: ${formatTime(remaining)}`;
      remaining -= 1000;
    }
  }, 1000);

  setTimeout(() => {
    XBtn.style.display = "inline-block";
    multiplySound.play().catch(() => {});
    timerDisplay.textContent = "Multiply available!";
    clearInterval(countdown);

    const visibleDuration = (Math.floor(Math.random() * 4) + 5) * 1000;
    setTimeout(() => {
      XBtn.style.display = "none";
      scheduleMultiplyButton();
    }, visibleDuration);
  }, delayMs);
}

scheduleMultiplyButton();

