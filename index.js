//Game Constants
const gameBoard = document.querySelector(".board");
const currentScore = document.querySelector("#current-score");
const highScoreCont = document.querySelector("#hi-score");
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("./food.mp3");
const gameOverSound = new Audio("./gameover.mp3");
const moveSound = new Audio("./move.mp3");
const musicSound = new Audio("./music.mp3");
let speed = 5; //control the speed of repaint
let lastPaintTime = 0; //in millisecods
let snakeArr = [{ x: 13, y: 15 }]; //initially head is at 13th column and 15th row
let food = { x: 5, y: 5 }; //initial food location
let score = 0;

// update high score in LS
let highScore = JSON.parse(localStorage.getItem("hi-score"));
if (highScore !== null) {
  highScoreCont.innerHTML = highScore;
} else {
  highScore = 0;
  localStorage.setItem("hi-score", JSON.stringify(0));
}

//Game Functions
function main(ctime) {
  window.requestAnimationFrame(main);
  //   console.log(ctime);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;

  gameEngine();
}

function isCollide(sarr) {
  //bump in yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (sarr[0].x === sarr[i].x && sarr[0].y === sarr[i].y) {
      return true;
    }
  }

  //if bump in wall
  if (sarr[0].x <= 0 || sarr[0].x >= 18 || sarr[0].y <= 0 || sarr[0].y >= 18) {
    return true;
  }

  return false;
}

function gameEngine() {
  // 1. update snake and food (on food eating increase snake body etc..)

  //if snake collides
  if (isCollide(snakeArr)) {
    musicSound.pause();
    gameOverSound.play();
    alert("The game is over,press any arrow key to restart game!");
    inputDir = { x: 0, y: 0 };
    food = { x: 5, y: 5 };
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    currentScore.innerHTML = score;
  }

  //when snake eats food then increase score,regenerate food,update snake body(snake array)
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    foodSound.play();
    score += 1;

    if (score > highScore) {
      localStorage.setItem("hi-score", JSON.stringify(score));
      highScoreCont.innerHTML = score;
    }

    currentScore.innerHTML = score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });

    let a = 2;
    let b = 16;
    food = {
      x: Math.floor(Math.random() * b + a),
      y: Math.floor(Math.random() * b + a),
    };
  }

  //Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] }; //put previous snake body segment at next segment
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  //2.display snake and food

  //snake display
  gameBoard.innerHTML = "";
  snakeArr.forEach((e, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridColumnStart = e.x;
    snakeElement.style.gridRowStart = e.y;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    gameBoard.appendChild(snakeElement);
  });

  //food display
  const foodElement = document.createElement("div");
  foodElement.style.gridColumnStart = food.x;
  foodElement.style.gridRowStart = food.y;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
}

//Main logic starts here
window.requestAnimationFrame(main);

//window event listner for key presses
window.addEventListener("keydown", (event) => {
  // inputDir = { x: 0, y: -1 }; //game start on any key press (move down)
  moveSound.play();
  musicSound.play();
  switch (event.key) {
    case "ArrowUp":
      inputDir.x = 0;
      inputDir.y = -1;
      break;
    case "ArrowLeft":
      inputDir.x = -1;
      inputDir.y = 0;
      break;
    case "ArrowRight":
      inputDir.x = 1;
      inputDir.y = 0;
      break;
    case "ArrowDown":
      inputDir.x = 0;
      inputDir.y = 1;
      break;
    default:
      break;
  }
});

//event listner for custom buttons
document.querySelectorAll(".control-btn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    let clickedKey = event.currentTarget.value;
    moveSound.play();
    musicSound.play();
    switch (clickedKey) {
      case "ArrowUp":
        console.log("ArrowUp");
        inputDir.x = 0;
        inputDir.y = -1;
        break;
      case "ArrowLeft":
        console.log("ArrowLeft");
        inputDir.x = -1;
        inputDir.y = 0;
        break;
      case "ArrowRight":
        console.log("ArrowRight");
        inputDir.x = 1;
        inputDir.y = 0;
        break;
      case "ArrowDown":
        console.log("ArrowDown");
        inputDir.x = 0;
        inputDir.y = 1;
        break;
    }
  });
});
