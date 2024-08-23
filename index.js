const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576; 

c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.2;

class Sprite{
  constructor({position,velocity}){
    this.position = position
    this.velocity = velocity
    this.height = 200
    this.width = 80
    this.lastkey
  }

  draw(){
    c.fillStyle = "red"
    c.fillRect(this.position.x,this.position.y,this.width,this.height)
  }

  update(){
    this.draw()
   
    this.position.x+= this.velocity.x
    this.position.y+=this.velocity.y

    if((this.position.y + this.height) >= canvas.height ){
      this.velocity.y = 0
    } else  this.velocity.y+= gravity
  
  }

}

const player = new Sprite({position:{x: 0, y: 0},velocity:{x:0,y:0}});


player.draw()

const enemy = new Sprite({position:{x: 500, y:0},velocity:{x:0,y:0}});

enemy.draw()


const keys ={
  a:{
    ispressed:false
  },
  d:{
    ispressed:false
  },
  w:{
    ispressed:false
  },
  ArrowLeft:{
    ispressed:false
  },
  ArrowRight:{
    ispressed:false
  },
  ArrowUp:{
    ispressed:false
  }
}

let lastkey

function animate(){
  window.requestAnimationFrame(animate)
  c.fillStyle="black"
  c.fillRect(0,0,canvas.width,canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  if(keys.a.ispressed && player.lastkey=='a'){
    player.velocity.x =-1
  } else if(keys.d.ispressed && player.lastkey=='d'){
    player.velocity.x = 1
  }

  enemy.velocity.x=0
  if(keys.ArrowLeft.ispressed && enemy.lastkey=='ArrowLeft'){
    enemy.velocity.x =-1
  } else if(keys.ArrowRight.ispressed && enemy.lastkey=='ArrowRight'){
    enemy.velocity.x = 1
  }
}

animate()

window.addEventListener('keydown' , (event)=>{
  switch (event.key){
    case 'd':
      keys.d.ispressed = true
      player.lastkey = 'd'
      break

    case 'a':
      keys.a.ispressed = true  
      player.lastkey='a'
      break
    case 'w':
        player.velocity.y =-10
      break

    case 'ArrowRight':
      keys.ArrowRight.ispressed = true
      enemy.lastkey = 'ArrowRight'
      break

    case 'ArrowLeft':
      keys.ArrowLeft.ispressed = true
      enemy.lastkey = 'ArrowLeft'
      break
    case 'ArrowUp':
      enemy.velocity.y =-10
      break
}})

window.addEventListener('keyup' , (event)=>{
  switch (event.key){
    case 'd':
      keys.d.ispressed = false
      break

    case 'a':
      keys.a.ispressed = false
      break

    case 'ArrowRight':
       keys.ArrowRight.ispressed = false
       break

    case 'ArrowLeft':
      keys.ArrowLeft.ispressed = false
      break

  }})

  

