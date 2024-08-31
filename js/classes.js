class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    frames = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frames = frames;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.frameHold = 4;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.frames),
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.frameHold === 0) {
      if (this.currentFrame < this.frames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    frames = 1,
    offset,
    sprites,
  }) {
    super({ position, imageSrc, scale, frames, offset });
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
    this.health = 100;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.frameHold = 6;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }
  update() {
    this.draw();
    this.animateFrames();
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
      this.position.y = canvas.height - this.height;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    if (!gameOver) {
      this.switchSprite("attack1");
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
      }, 100);
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.attack1.image && this.currentFrame < this.sprites.attack1.frames - 1) {
      return; 
  }
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frames = this.sprites.idle.frames;
          this.currentFrame = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frames = this.sprites.run.frames;
          this.currentFrame = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frames = this.sprites.jump.frames;
          this.currentFrame = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frames = this.sprites.fall.frames;
          this.currentFrame = 0;
        }
        break;
        case "attack1":
          if (this.image !== this.sprites.attack1.image) {
            this.image = this.sprites.attack1.image;
            this.frames = this.sprites.attack1.frames;
            this.currentFrame = 0;
          }
    }
  }
}
