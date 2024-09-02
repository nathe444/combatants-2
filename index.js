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
  offset: { x:255, y: 180 },
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
    },
    attack2:{
      imageSrc:'./assets/player1/Attack2.png',
      frames:6
    },
    takeHit:{
      imageSrc:'./assets/player1/Take hit.png',
      frames:4
    },
    death:{
      imageSrc:'./assets/player1/Death.png',
      frames:6
    }
  },
  frameHold:5,
  attackBox : { offset: { x: 80, y: 70 }, width: 225, height:50 }
});

const enemy = new Fighter({
  position: { x: 850, y:0 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x:255, y:200 },
  imageSrc:'./assets/player2/Idle.png',
  frames:4,
  scale:3,
  sprites:{
    idle:{
      imageSrc:'./assets/player2/Idle.png',
      frames:4,
    },
    run:{
      imageSrc:'./assets/player2/Run.png',
      frames:8,
    },
    jump:{
      imageSrc:'./assets/player2/Jump.png',
      frames:2
    },
    fall:{
      imageSrc:'./assets/player2/Fall.png',
      frames:2
    },
    attack1:{
      imageSrc:'./assets/player2/Attack1.png',
      frames:4
    },
    attack2:{
      imageSrc:'./assets/player2/Attack2.png',
      frames:4
    },
    takeHit:{
      imageSrc:'./assets/player2/Take hit.png',
      frames:3
    },
    death:{
      imageSrc:'./assets/player2/Death.png',
      frames:7
    }
  },
  frameHold:8,
  attackBox : { offset: { x: -210, y: 70 }, width: 225, height:50 }
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
  enemy.update();


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
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.ispressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite('run');
  } else{
    enemy.switchSprite('idle')
  }

  if(enemy.velocity.y < 0){
    enemy.switchSprite('jump');
  } else if(enemy.velocity.y >0){
    enemy.switchSprite('fall')
  }

  if (
    rectangleCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking && player.currentFrame === 4
  ) {
    enemy.switchSprite("takeHit");
    player.isAttacking = false;
    enemy.health = Math.max(0, enemy.health - 10);
    updateHealthBar("enemyHealth", enemy.health);
    // Check if enemy's health reaches zero
    if (enemy.health <= 0) {
      enemy.switchSprite('death');
      setTimeout(() => {
        declareWinner("player1");   
      },1100)
        
      return;
    }
  }

  if(player.isAttacking && player.currentFrame === 4){
    player.isAttacking = false
  }

  if (
    rectangleCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking && enemy.currentFrame === 2
  ) {
    player.switchSprite("takeHit");
    enemy.isAttacking = false;
    player.health = Math.max(0, player.health - 10);
    updateHealthBar("playerHealth", player.health);

    // Check if player's health reaches zero
    if (player.health <= 0) {
      player.switchSprite('death');
      setTimeout(() => {
        declareWinner("player2");
      },600)
      return;
    }
  }
  if(enemy.isAttacking && enemy.currentFrame === 2){
    enemy.isAttacking = false
  }

  if(enemy.health <= 0 ){
    enemy.switchSprite('death');
  }

  if(player.health <= 0 ){
    player.switchSprite('death');
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
    case 'e':
      player.attack1();
      break;
    case 'q':
      player.attack2();
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
      enemy.velocity.y = -25;
      break;
    case '\\':
      enemy.attack1();
      break;
    case "End":
      enemy.attack2();
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
