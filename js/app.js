"use strict";

// 1. Game settings
const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

// 2. Select HTML elements
const guessForm = document.querySelector("#guessForm");
const guessInput = document.querySelector("#guessInput");
const guessButton = document.querySelector("#guessButton");
const restartButton = document.querySelector("#restartButton");

const numberDisplay = document.querySelector("#numberDisplay");
const questionMark = document.querySelector(".question-mark");

const messageBox = document.querySelector("#messageBox");
const messageText = document.querySelector("#messageText");
const messageIcon = document.querySelector(".message-icon");

const attemptCount = document.querySelector("#attemptCount");
const lastGuessDisplay = document.querySelector("#lastGuess");

// 3. Game state
let secretNumber = generateRandomNumber();
let attempts = 0;
let lastGuess = null;
let gameOver = false;

// 4. Generate a random number
function generateRandomNumber() {
  return Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
}

// 5. Update game statistics
function updateStats() {
  attemptCount.textContent = attempts;

  lastGuessDisplay.textContent = lastGuess === null ? "—" : lastGuess;
}

// 6. Display feedback messages
function showMessage(message, state = "neutral", icon = "✦") {
  messageText.textContent = message;
  messageBox.dataset.state = state;
  messageIcon.textContent = icon;

  messageBox.classList.remove("is-updated");

  // Restart the message animation
  void messageBox.offsetWidth;

  messageBox.classList.add("is-updated");
}

// 7. Validate the player's guess
function validateGuess(value) {
  if (value.trim() === "") {
    return {
      valid: false,
      message: "Please enter a number first.",
    };
  }

  const guess = Number(value);

  if (!Number.isInteger(guess)) {
    return {
      valid: false,
      message: "Please enter a whole number.",
    };
  }

  if (guess < MIN_NUMBER || guess > MAX_NUMBER) {
    return {
      valid: false,
      message: `Enter a number between ${MIN_NUMBER} and ${MAX_NUMBER}.`,
    };
  }

  return {
    valid: true,
    guess,
  };
}

// 8. Reveal the secret number
function revealNumber() {
  questionMark.textContent = secretNumber;

  numberDisplay.setAttribute(
    "aria-label",
    `The secret number is ${secretNumber}`,
  );
}

// 9. Finish the game
function finishGame() {
  gameOver = true;

  revealNumber();

  showMessage(
    `Correct! You found the number in ${attempts} ${
      attempts === 1 ? "attempt" : "attempts"
    }. Well done!`,
    "success",
    "✓",
  );

  guessButton.disabled = true;
  guessInput.disabled = true;

  restartButton.focus();
}

// 10. Check the player's guess
function checkGuess(event) {
  event.preventDefault();

  if (gameOver) {
    return;
  }

  const result = validateGuess(guessInput.value);

  if (!result.valid) {
    showMessage(result.message, "error", "!");
    guessInput.focus();
    return;
  }

  const guess = result.guess;

  // Record the attempt
  attempts++;
  lastGuess = guess;

  updateStats();

  // Compare the guess with the secret number
  if (guess < secretNumber) {
    showMessage("Too low! Try a higher number.", "low", "↗");
  } else if (guess > secretNumber) {
    showMessage("Too high! Try a lower number.", "high", "↘");
  } else {
    finishGame();
  }

  // Prepare for the next guess
  if (!gameOver) {
    guessInput.value = "";
    guessInput.focus();
  }
}

// 11. Restart the game
function restartGame() {
  secretNumber = generateRandomNumber();
  attempts = 0;
  lastGuess = null;
  gameOver = false;

  guessInput.value = "";
  guessInput.disabled = false;
  guessButton.disabled = false;

  questionMark.textContent = "?";

  numberDisplay.setAttribute("aria-label", "Secret number hidden");

  updateStats();

  showMessage("Ready? Enter your first guess!", "neutral", "✦");

  guessInput.focus();
}

// 12. Connect events
guessForm.addEventListener("submit", checkGuess);

restartButton.addEventListener("click", restartGame);

// 13. Set input boundaries
guessInput.min = MIN_NUMBER;
guessInput.max = MAX_NUMBER;
guessInput.step = 1;

// 14. Initialize the game
updateStats();

showMessage("Ready? Enter your first guess!", "neutral", "✦");

console.log("NUMORA game is ready!");
