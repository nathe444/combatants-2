
function rectangleCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function updateHealthBar(elementId, health) {
  const healthBar = document.querySelector(`#${elementId}`);
  let healthWidth = Math.max(0, health); 
  healthBar.style.width = `${healthWidth}%`;
}

function declareWinner(winner) {
  gameOver = true; 
  clearInterval(timerInterval); 
  if (winner === "player1") {
    document.querySelector("#player1").style.display = "flex";
  } else {
    document.querySelector("#player2").style.display = "flex";
  }
}

function checkWinner() {
  if (gameOver) return; 

  if (player.health === enemy.health) {
    document.querySelector("#tie").style.display = "flex";
    gameOver = true;
    return;
  }
  if (player.health > enemy.health) {
    declareWinner("player1");
  } else {
    declareWinner("player2");
  }
}

let timerInterval;
function decreaseTimer() {
  let timer = document.querySelector("#timer");
  let timerValue = parseInt(timer.innerHTML);
  if (isNaN(timerValue) || timerValue < 0) {
    console.error("Invalid timer value");
  } else {
    timerInterval = setInterval(() => {
      if (timerValue > 0) {
        timerValue -= 1;
        timer.innerHTML = timerValue;
      } else {
        clearInterval(timerInterval);
        checkWinner(); // Check winner when timer reaches zero
      }
    }, 1000);
  }
}