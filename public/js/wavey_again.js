/*
  Date: Friday 7th October 2022

  It's late and inspiration struck at 2am. I may as well make something while it's in my head.

  I want to make waves that weave in and out of each other on the Z-axis by transparency and size
  also make them move toward the left side of the screen
  also make them differ in y axis <- noise offset

*/

let waves = []
let wavesNum = 5
let orbs = []
let orbsNum = 35
let shorter
let xBound = 50

// RESIZE FUNCTIONS
function windowResized() {
  calcShorter()
  resizeCanvas(shorter, shorter)
}

function calcShorter() {
  shorter = min(windowWidth, windowHeight)
}
// ================

function setup() {
  calcShorter()
  // createCanvas(shorter, shorter)
  createCanvas(windowWidth, windowHeight)

  angleMode(DEGREES)
  rectMode(CENTER)
  noStroke()
  colorMode(HSB, 255)

  for (let i=0; i<wavesNum; i++) {
    let wave = []
    let hoff = random(9999)
    let noff = random(9999)
    let aoff = random(9999)
    let soff = random(9999)
    for (let j=0; j<orbsNum; j++) {
      let x = map(j, 0, orbsNum-1, -xBound, width+xBound)
      wave.push(new Orb(x, height/2, hoff, noff, aoff, soff))
    }
    waves.push(wave)
  }
    
}

function draw() {
  background(0, 0, 30)


  for (let i=0; i<waves.length; i++) {
    for (let j=0; j<waves[i].length; j++) {
      if (waves[i][j].pos.x < -xBound) {
        waves[i].push(new Orb(width+xBound, height/2, waves[i][j+1].hoff, waves[i][j+1].noff, waves[i][j+1].aoff, waves[i][j+1].soff))
        waves[i].splice(0, 1)
      } else {
        waves[i][j].run()
      }
    }
  }
}

class Orb {
  constructor(x, y, hoff, noff, aoff, soff) {
    this.h = y
    this.hoff = hoff
    this.pos = createVector(x, y)
    this.noff = noff
    this.aoff = aoff
    this.soff = soff
    this.a
    this.s
  }

  calcY() {
    let n = noise((this.pos.x+frameCount)*0.005+this.noff)
    let yNoise = map(n, 0, 1, -height*0.125, height*0.125)
    let t = sin(frameCount*1+this.hoff)
    let yRange = createVector(-50, 50)
    let ySin = map(t, -1, 1, yRange.x, yRange.y)
    this.pos.y = this.h + yNoise // + ySin
  }

  calcA() {
    let t = sin(frameCount*1+this.aoff)
    let aRange = createVector(0, 255)
    this.a = map(t, -1, 1, aRange.x, aRange.y)
  }

  calcS() {
    let t = sin(frameCount*1+this.soff)
    let sRange = createVector(20, 10)
    this.s = map(t, -1, 1, sRange.x, sRange.y)
  }

  update() {
    this.calcY()
    this.calcA()
    this.calcS()
    this.pos.x -= 0.1
  }

  display() {
    fill(55, 100, 200, this.a)
    ellipse(this.pos.x, this.pos.y, this.s)
  }

  run() {
    this.update()
    this.display()
  }
}