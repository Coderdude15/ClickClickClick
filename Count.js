let AddBtn = document.getElementById("AddBtn");
let XBtn = document.getElementById("XBtn");
let CountText = document.getElementById("Count");
let CurrentScoreCount = document.getElementById("CurrentScoreCounter");
let HighScoreCount = document.getElementById("HighScoreCounter");
let XSound = document.getElementById("multiplySound");

// Start with Multiply button hidden
XBtn.style.display = "none";

let Count = 0;
let CurrentScore = 0;
let HighScore = 0;

// Load high score from localStorage
function loadHighScore() {
    const savedScore = parseInt(localStorage.getItem("HighScore")) || 0;
    const savedTimestamp = parseInt(localStorage.getItem("HighScoreTimestamp")) || 0;
    const now = Date.now();

    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (now - savedTimestamp > oneWeek) {
        // Reset high score if it's older than a week
        HighScore = 0;
        localStorage.setItem("HighScore", 0);
        localStorage.setItem("HighScoreTimestamp", now.toString());
    } else {
        HighScore = savedScore;
    }

    HighScoreCount.innerText = HighScore;
}

function updateHighScore() {
    if (CurrentScore > HighScore) {
        HighScore = CurrentScore;
        HighScoreCount.innerText = HighScore;
        localStorage.setItem("HighScore", HighScore.toString());
        localStorage.setItem("HighScoreTimestamp", Date.now().toString());
    }
}

function Add() {
    Count += 2;
    CountText.innerText = Count;
    CurrentScore += 2;
    CurrentScoreCount.innerText = CurrentScore;
    updateHighScore();
}

function X() {
    Count *= 1.2;
    CountText.innerText = Math.floor(Count);
    CurrentScore *= 1.2;
    CurrentScoreCount.innerText = Math.floor(CurrentScore);
    updateHighScore();
}

// Run on page load
loadHighScore();

function handleScoreSubmit() {
    const username = document.getElementById("usernameInput").value.trim();
    const status = document.getElementById("submitStatus");

    console.log("Submitting score...");

    if (!username) {
        status.textContent = "Please enter a name.";
        return;
    }

    submitScore(username, CurrentScore);
    status.textContent = "Score submitted!";
    document.getElementById("usernameInput").value = "";
}

// Sound element
const multiplySound = document.getElementById("multiplySound");

// ✅ Unlock sound on first user interaction
document.addEventListener("click", () => {
    multiplySound.play().then(() => {
        multiplySound.pause();
        multiplySound.currentTime = 0;
    }).catch((e) => {
        console.warn("Initial sound unlock failed:", e);
    });
}, { once: true });

// Timer display element
const timerDisplay = document.getElementById("multiplyTimer");

let countdownInterval;

// Utility: Get random time in milliseconds between min and max minutes
function getRandomMinutesInMs(minMinutes, maxMinutes) {
    const min = minMinutes * 60 * 1000;
    const max = maxMinutes * 60 * 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility: Get random time in milliseconds between min and max seconds
function getRandomSecondsInMs(minSeconds, maxSeconds) {
    const min = minSeconds * 1000;
    const max = maxSeconds * 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility: Convert milliseconds to mm:ss format
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
}

// Main loop to toggle Multiply button visibility
function scheduleMultiplyButton() {
    const delayToShow = getRandomMinutesInMs(5, 10); // 5–10 min
    let remainingTime = delayToShow;

    // Update timer every second
    countdownInterval = setInterval(() => {
        remainingTime -= 1000;
        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
        } else {
            timerDisplay.textContent = `Multiply in: ${formatTime(remainingTime)}`;
        }
    }, 1000);

    setTimeout(() => {
        // Show button
        XBtn.style.display = "inline-block";
        clearInterval(countdownInterval);
        timerDisplay.textContent = "Multiply is available!";
        console.log("🔔 Multiply button SHOWN!");

        // ✅ Play the multiply sound
        multiplySound.play().catch((e) => {
            console.warn("Multiply sound could not play:", e);
        });

        const visibleDuration = getRandomSecondsInMs(10, 15); // 10–15 sec

        setTimeout(() => {
            // Hide button again
            XBtn.style.display = "none";
            console.log("❌ Multiply button HIDDEN.");

            // Schedule next appearance
            scheduleMultiplyButton();
        }, visibleDuration);
    }, delayToShow);
}

// Start the multiply button cycle
scheduleMultiplyButton();
