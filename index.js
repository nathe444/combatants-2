const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 1.25;
let gameOver = false; 

const background = new Sprite({
  position:{
    x:0,
    y:0
  },
  imageSrc : "./assets/mars.jpg"
})

const shop = new Sprite(
  {
    position:{
      x:340,
      y:200
    },
    imageSrc: './assets/shop.png',
    scale :2.33,
    frames :6
  },
 
)

const player = new Fighter({
  position: { x: 120, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 260, y: 180 },
  imageSrc:'./assets/player1/Idle.png',
  frames:8,
  scale:3,
  sprites:{
    idle:{
      imageSrc:'./assets/player1/Idle.png',
      frames:8,
    },
    run:{
      imageSrc:'./assets/player1/Run.png',
      frames:8,
    },
    jump:{
      imageSrc:'./assets/player1/Jump.png',
      frames:2
    },
    fall:{
      imageSrc:'./assets/player1/Fall.png',
      frames:2
    },
    attack1:{
      imageSrc:'./assets/player1/Attack1.png',
      frames:6
    }
  }
});

const enemy = new Fighter({
  position: { x: 450, y:0 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: 10, y:200 },
  imageSrc:'./assets/player2/Idle.png',
  frames:4,
  scale:3
});

const keys = {
  a: { ispressed: false },
  d: { ispressed: false },
  w: { ispressed: false },
  ArrowLeft: { ispressed: false },
  ArrowRight: { ispressed: false },
  ArrowUp: { ispressed: false },
};



function animate() {
  if (gameOver) return; 
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  // enemy.update();

  player.velocity.x = 0;
  if (keys.a.ispressed && player.lastkey === "a") {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (keys.d.ispressed && player.lastkey === "d") {
    player.velocity.x = 5;
    player.switchSprite('run');
  } else {
       player.switchSprite('idle')
  }

  if(player.velocity.y < 0){
    player.switchSprite('jump');
  } else if(player.velocity.y >0){
    player.switchSprite('fall')
  }


  enemy.velocity.x = 0;
  if (keys.ArrowLeft.ispressed && enemy.lastkey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.ispressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 5;
  }



  if (
    rectangleCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health = Math.max(0, enemy.health - 10);
    updateHealthBar("enemyHealth", enemy.health);

    // Check if enemy's health reaches zero
    if (enemy.health <= 0) {
      declareWinner("player1");
      return;
    }

  }

  if (
    rectangleCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health = Math.max(0, player.health - 10);
    updateHealthBar("playerHealth", player.health);

    // Check if player's health reaches zero
    if (player.health <= 0) {
      declareWinner("player2");
      return;
    }
  }
}

decreaseTimer();
animate();



window.addEventListener("keydown", (event) => {
  if (gameOver) return; 

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
      player.velocity.y = -25;
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
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  if (gameOver) return; 

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
