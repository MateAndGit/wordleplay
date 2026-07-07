const col = 6;
const keyBoradArray = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["✖️", "Z", "X", "C", "V", "B", "N", "M", "Enter"],
];
const SERVER_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";
const ERROR_MSG = "No Definitions Found";

const $wordleContainer = document.getElementById("wordle__container");
const $keyboardContainer = document.getElementById("keyboard__container");

let correctWord = "teamo";
let row = correctWord.length;
let wordleList = Array.from({ length: col }, () =>
  Array.from({ length: row }, () => ({
    text: "",
    isCorrect: false,
    isExist: false,
  })),
);
let guessWordle = [];
let rowCount = 0;
let guessAttemp = 0;

function handleInputKey(btn) {
  if (guessWordle.length >= row) {
    return;
  }

  const key = btn;
  guessWordle.push(key);

  const currentIndex = guessAttemp * row + rowCount;
  const $currentBox = document.querySelector(`[data-index="${currentIndex}"]`);
  $currentBox.textContent = key;
  $currentBox.classList.add("effect");
  rowCount++;
  console.log(currentIndex, rowCount, guessWordle.length);
}

function handleBackspace() {
  if (guessWordle.length == 0) {
    return;
  }
  guessWordle.pop();
  rowCount--;
  const currentIndex = guessAttemp * row + rowCount;
  const $currentBox = document.querySelector(`[data-index="${currentIndex}"]`);
  $currentBox.textContent = "";
  $currentBox.classList.remove("effect");

  console.log(currentIndex, rowCount, guessWordle.length);
}

function testGuess(gessWord) {
  correctWord = correctWord.toUpperCase();
  gessWord = gessWord.toUpperCase();

  let correctArr = correctWord.split("");
  let gessArr = gessWord.split("");

  let samePosition = 0;
  let differPosition = 0;
  let isAnswer = false;

  for (let i = 0; i < correctArr.length; i++) {
    const currentIndex = guessAttemp * row + i;
    const $currentBox = document.querySelector(
      `[data-index="${currentIndex}"]`,
    );
    if (correctArr[i] === gessArr[i]) {
      samePosition++;
      gessArr[i] = "";
      correctArr[i] = "";
      $currentBox.classList.add("correct");
    }
  }

  for (let i = 0; i < gessArr.length; i++) {
    const currentIndex = guessAttemp * row + i;
    const $currentBox = document.querySelector(
      `[data-index="${currentIndex}"]`,
    );
    if (gessArr[i] === "") {
      continue;
    }
    if (correctArr.includes(gessArr[i])) {
      differPosition++;
      $currentBox.classList.add("present");
    } else {
      $currentBox.classList.add("absent");
    }
  }

  if (correctWord.length === samePosition) {
    isAnswer = true;
    alert("gooooood");

    guessAttemp = 0;
    rowCount = 0;
    guessWordle = [];

    wordleList = Array.from({ length: col }, () =>
      Array.from({ length: row }, () => ({
        text: "",
        isCorrect: false,
        isExist: false,
      })),
    );

    loadWodleBoxes();
  }
  if (!isAnswer) {
    if (++guessAttemp === col) {
      if (confirm("정답을 확인하시겠습니까?")) {
        alert(correctWord);
        guessAttemp = 0;
        wordleList = Array.from({ length: col }, () =>
          Array.from({ length: row }, () => ({
            text: "",
            isCorrect: false,
            isExist: false,
          })),
        );
        loadWodleBoxes();
      }
    }
    guessWordle = [];
    rowCount = 0;
    console.log("samePosition : " + samePosition);
    console.log("differPosition : " + differPosition);
  }
}

function handleEnter() {
  if (guessWordle.length !== row) {
    return;
  }

  let guessWord = "";
  guessWordle.map((w) => (guessWord += w));

  testGuess(guessWord);
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();

  if (/^[A-Z]$/.test(key)) {
    handleInputKey(key);
  }

  if (event.key === "Backspace") {
    handleBackspace();
  }

  if (event.key === "Enter") {
    handleEnter();
  }
});

function loadWodleBoxes() {
  const wordleHTML = wordleList
    .map((wordRow, i) => {
      const boxesHTML = wordRow
        .map((box, j) => {
          const index = i * row + j;
          return `<div class="wordle__box" data-index="${index}"></div>`;
        })
        .join("");
      return `<div class="wordle__row">${boxesHTML}</div>`;
    })
    .join("");
  $wordleContainer.innerHTML = wordleHTML;
}

function loadKeyborad() {
  if (keyBoradArray.length === 0) {
    return;
  }
  const keyBoredHTML = keyBoradArray
    .map((row) => {
      const keyboardBtn = row
        .map((char) => {
          if (char === "✖️" || char === "Enter") {
            if (char === "Enter") {
              return `<div class="keyboard__button special__key" onclick=" handleEnter()">${char}</div>`;
            }
            return `<div class="keyboard__button special__key">${char}</div>`;
          }
          return `<div class="keyboard__button" onclick="handleInputKey(this.textContent)">${char}</div>`;
        })
        .join("");
      return `<div class="keyboard__row">${keyboardBtn}</div>`;
    })
    .join("");
  $keyboardContainer.innerHTML = keyBoredHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  loadWodleBoxes();
  loadKeyborad();
});
