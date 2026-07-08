const col = 6;
const keyBoradArray = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["✖️", "Z", "X", "C", "V", "B", "N", "M", "Enter"],
];
const SERVER_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";
const RANDOM_WORD_URL = "https://random-word-api.herokuapp.com/word?length=4";
const ERROR_MSG = "No Definitions Found";

const $wordleContainer = document.getElementById("wordle__container");
const $keyboardContainer = document.getElementById("keyboard__container");

let correctWord = "apple"; // 💡 에러 방지용 기본 단어 세팅
let row = correctWord.length;
let wordleList = Array.from(Array(col), () => new Array(row).fill(""));
let guessWordle = [];
let rowCount = 0;
let guessAttemp = 0;

async function setRandomWord() {
  try {
    const response = await fetch(RANDOM_WORD_URL);
    if (!response.ok) throw new Error("단어를 가져오는데 실패함");

    const data = await response.json();
    correctWord = data[0].toLowerCase();
    row = correctWord.length;

    wordleList = Array.from(Array(col), () => new Array(row).fill(""));
    console.log("이번 판 정답(치트키):", correctWord); // 테스트용 로그
  } catch (e) {
    console.error("랜덤 단어 로딩 실패, 기본 단어로 대체합니다:", e);
    correctWord = "apple"; // 인터넷이 끊기는 등 에러 나면 기본 단어로 안전장치
  }
}

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
}

async function testGuess(gessWord) {
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

    wordleList = Array.from(Array(col), () => new Array(row).fill(""));
    await setRandomWord();
    loadWodleBoxes();
  }
  if (!isAnswer) {
    ++guessAttemp;
    if (guessAttemp === 5) {
      if (confirm("정답을 확인하시겠습니까?")) {
        alert(correctWord);
        guessAttemp = 0;
        wordleList = Array.from(Array(col), () => new Array(row).fill(""));
        await setRandomWord();
        loadWodleBoxes();
      }
    }
    if (guessAttemp === col) {
      if (confirm("정답을 확인하시겠습니까?")) {
        alert(correctWord);
        guessAttemp = 0;
        wordleList = Array.from(Array(col), () => new Array(row).fill(""));
        await setRandomWord();
        loadWodleBoxes();
      }
    }
    guessWordle = [];
    rowCount = 0;
    console.log("samePosition : " + samePosition);
    console.log("differPosition : " + differPosition);
  }
}

async function handleEnter() {
  if (guessWordle.length !== row) {
    return;
  }

  let guessWord = guessWordle.join("").toLowerCase();

  try {
    const response = await fetch(`${SERVER_URL}/${guessWord}`);

    if (!response.ok) {
      alert("사전에 등록되지 않은 단어입니다! ✖️");
      return;
    }

    await testGuess(guessWord);
  } catch (e) {
    console.error("네트워크 에러 발생:", e);
  }
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
            return `<div class="keyboard__button special__key" onclick="handleBackspace()">${char}</div>`;
          }
          return `<div class="keyboard__button" onclick="handleInputKey(this.textContent)">${char}</div>`;
        })
        .join("");
      return `<div class="keyboard__row">${keyboardBtn}</div>`;
    })
    .join("");
  $keyboardContainer.innerHTML = keyBoredHTML;
}

document.addEventListener("DOMContentLoaded", async () => {
  await setRandomWord();
  loadWodleBoxes();
  loadKeyborad();
});
