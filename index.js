const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 1;

class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 200;
    this.width = 70;
    this.lastkey;
    this.offset = {
      x: offset.x,
      y: offset.y,
    };
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 120,
      height: 60,
    };
    this.color = color;
    this.isAttacking;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    c.fillStyle = "green";

    if (this.isAttacking) {
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;

    if (this.position.x < 0) {
      this.position.x = 0;
    } else if (this.position.x + this.width > canvas.width) {
      this.position.x = canvas.width - this.width;
    }

    this.position.y += this.velocity.y;

    if (this.position.y + this.height >= canvas.height) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      player.isAttacking = false;
      enemy.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: { x: 120, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
});

player.draw();

const enemy = new Sprite({
  position: { x: 850, y: 0 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: -50, y: 0 },
});

enemy.draw();

const keys = {
  a: {
    ispressed: false,
  },
  d: {
    ispressed: false,
  },
  w: {
    ispressed: false,
  },
  ArrowLeft: {
    ispressed: false,
  },
  ArrowRight: {
    ispressed: false,
  },
  ArrowUp: {
    ispressed: false,
  },
};

let lastkey;

function rectangleCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function decreaseTimer() {
  let timer = document.querySelector("#timer");
  let timerValue = parseInt(timer.innerHTML);
  if (isNaN(timerValue) || timerValue < 0) {
    console.error("Invalid timer value");
  } else {
    const interval = setInterval(() => {
      if (timerValue > 0) {
        timerValue -= 1;
        timer.innerHTML = timerValue;
      } else {
        clearInterval(interval);
        alert("Timer has ended");
        window.location.reload();
      }
    }, 1000);
  }
}

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  if (keys.a.ispressed && player.lastkey == "a") {
    player.velocity.x = -5;
  } else if (keys.d.ispressed && player.lastkey == "d") {
    player.velocity.x = 5;
  }

  enemy.velocity.x = 0;
  if (keys.ArrowLeft.ispressed && enemy.lastkey == "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.ispressed && enemy.lastkey == "ArrowRight") {
    enemy.velocity.x = 5;
  }

  if (
    rectangleCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;

    const enemyHealth = document.querySelector("#enemyHealth");
    let enemyHealthWidth = parseInt(enemyHealth.style.width || "100");
    enemyHealthWidth = Math.max(0, enemyHealthWidth - 10);

    enemyHealth.style.width = enemyHealthWidth + "%";
  }

  if (
    rectangleCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    const playerHealth = document.querySelector("#playerHealth");
    let playerHealthWidth = parseInt(playerHealth.style.width || "100");
    playerHealthWidth = Math.max(0, playerHealthWidth - 10);
    playerHealth.style.width = playerHealthWidth + "%";
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.ispressed = true;
      player.lastkey = "d";
      break;

    case "a":
      keys.a.ispressed = true;
      player.lastkey = "a";
      break;
    case "w":
      player.velocity.y = -18;
      break;

    case " ":
      player.attack();
      break;

    case "ArrowRight":
      keys.ArrowRight.ispressed = true;
      enemy.lastkey = "ArrowRight";
      break;

    case "ArrowLeft":
      keys.ArrowLeft.ispressed = true;
      enemy.lastkey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -18;
      break;

    case "ArrowDown":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.ispressed = false;
      break;

    case "a":
      keys.a.ispressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.ispressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.ispressed = false;
      break;
  }
});
