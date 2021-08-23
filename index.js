const $gameTitle = document.querySelector(".title");
const $gameExplain = document.querySelector(".explain");
const $wrapStartButton = document.querySelector(".start-button-outline");
const $startButton = document.querySelector(".start-button");
const $lastMent = document.querySelector(".last-ment");
const $wrapRestartButton = document.querySelector(".restart-button-outline")
const $restartButton = document.querySelector(".restart-button");
const $gameImageBoard = document.querySelector(".game-image");
const $gameCards = document.querySelectorAll(".img-section");
const $timer = document.querySelector(".timer");
const $hintChance = document.querySelector(".hint-chance");
const $hint = document.querySelector(".hint");
const $sound = document.querySelector(".sound");

const changeimages = [
  "./image/dobby.jpg",
  "./image/dumbledore.jpg",
  "./image/friends.jpg",
  "./image/harry.jpg",
  "./image/hermione.jpg",
  "./image/malfoy.jpg",
  "./image/map.jpg",
  "./image/platform.jpg",
  "./image/ron.jpg",
  "./image/snape.jpg",
  "./image/dementor.jpg",
  "./image/neville.jpg"
];
const hidden = "hidden";
const basicImagePath = "./image/basic-image.jpg";
const audio = new Audio("Hedwig's Theme.mp3");
let imageCompare = new Array();
let timerIntervalID;
let correctCard = 0;
let cardClickCount = -1;
let hintClickCount;

setClassName($hint, hidden);
setClassName($wrapRestartButton, hidden);
setClassName($sound, hidden);
setClassName($gameImageBoard, hidden);
setClassName($hintChance, hidden);

$startButton.addEventListener("click", handleStartButtonClick);
$hint.addEventListener("click", handleHintClick);
$restartButton.addEventListener("click", handleRestartButtonClick);
$sound.addEventListener("click", handleSoundClick);

function handleStartButtonClick() {
  let second = 45;
  hintClickCount = 3;

  $gameCards.forEach((card) => {
    card.addEventListener("click", handleGameCardClick);
  });

  setClassName($gameTitle, hidden);
  setClassName($gameExplain, hidden);
  setClassName($wrapStartButton, hidden);
  setClassName($wrapRestartButton, hidden);
  setClassName($lastMent, hidden);
  setClassName($gameImageBoard, hidden, false);
  setClassName($timer, hidden, false);
  setClassName($hintChance, hidden, false);
  setClassName($hint, hidden, false);
  setClassName($sound, hidden, false);

  audio.currentTime = 0;
  audio.play();

  for(let i = 0; i < $gameCards.length; i++) {
    $gameCards[i].dataset.index = Math.floor(Math.random() * 24);
    for(let j = i-1; j >= 0; j--) {
      if($gameCards[i].dataset.index === $gameCards[j].dataset.index) {
        i = i-1;
        break;
      }
    }
  }

  $gameCards.forEach(card => {
    if(parseInt(card.dataset.index) >= 12) {
      card.dataset.index %= 12;
    }
  });

  if(hintClickCount === 3) {
    $hintChance.textContent = ("Number of hints : " + hintClickCount);
  }

  $timer.textContent = ("Remain Time : " + second);
  timerIntervalID = setInterval(() => {
    if(second > 0) {
      second -= 1;
      $timer.textContent = ("Remain Time : " + second);
    } else {
      gameOver();
    }
  }, 1000);
}

function handleGameCardClick(event) {
  if((cardClickCount < 1)) {
    cardClickCount += 1;
    event.target.src = changeimages[event.target.dataset.index];
    imageCompare[cardClickCount] = event.target.src;
    event.target.dataset.clickOrNot = "O";
    $gameCards.forEach((card) => {
      if(card.dataset.clickOrNot === "O") {
        card.removeEventListener("click", handleGameCardClick);
      }
    });
  }

  if((imageCompare[1]) && (imageCompare[0] !== imageCompare[1])) {
    setTimeout(() => {
      $gameCards.forEach(card => {
        if(card.src === imageCompare[0] || card.src === imageCompare[1]) {
          card.src = basicImagePath;
          card.dataset.clickOrNot = null;
          card.addEventListener("click", handleGameCardClick);
        }
      });
      imageCompare = imageCompare.map(x => null);
    }, 400);
    cardClickCount = -1;
  } else if(imageCompare[0] === imageCompare[1]) {
    $gameCards.forEach(card => {
      if(card.src === imageCompare[0] || card.src === imageCompare[1]) {
        card.dataset.correct = "O";
        correctCard += 1;
      }
    });
    imageCompare = imageCompare.map(x => null);
    cardClickCount = -1;
  }

  if(correctCard === 24) {
    setTimeout(() => {
      gameOver();
    }, 300);
  }
}

function handleHintClick() {
  hintClickCount -= 1;
  $hintChance.textContent = ("Number of hints : " + hintClickCount);

  if(hintClickCount >= 0) {
    $gameCards.forEach(card => {
      card.src = changeimages[card.dataset.index];
    });

    setTimeout(() => {
      $gameCards.forEach(card => {
        if(card.dataset.correct !== "O") {
          card.src = basicImagePath;
        }
      });
      if(hintClickCount === 0) {
        setClassName($hint, hidden);
      }
    }, 1000);
  }

  cardClickCount = -1;
}

function handleSoundClick() {
  if($sound.src.includes("sound")) {
    $sound.src = "./image/mute.png";
    audio.pause();
  } else {
    $sound.src = "./image/sound.png";
    audio.play();
  }
}

function gameOver() {
  clearInterval(timerIntervalID);
  setClassName($timer, hidden);
  setClassName($hintChance, hidden);
  setClassName($hint, hidden);
  setClassName($gameImageBoard, hidden);
  setClassName($sound, hidden);
  setClassName($lastMent, hidden, false);
  setClassName($gameTitle, hidden, false);
  setClassName($wrapRestartButton, hidden, false);

  audio.pause();

  switch (true) {
    case (correctCard/2 <= 5):
      $lastMent.innerHTML = "Your score is " + (correctCard/2) + "/12🍎<br/>You need to push yourself a little more🙄";
      break;
    case (correctCard/2 <= 9):
      $lastMent.innerHTML = "Your score is " + (correctCard/2) + "/12🍎<br/>You are doing well😏"
      break;
    default:
      $lastMent.innerHTML = "Your score is " + (correctCard/2) + "/12🍎<br/>Your memory is the best👍"
      break;
  }
}

function handleRestartButtonClick() {
  correctCard = 0;
  $gameCards.forEach((card) => {
    card.src = basicImagePath;
    card.dataset.correct = null;
    card.dataset.clickOrNot = null;
  });
  handleStartButtonClick();
}

function setClassName($element, className, flag = true) {
  if(flag) {
    $element.classList.add(className);
  } else {
    $element.classList.remove(className);
  }
}
