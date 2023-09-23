/*
  Date: Friday 22nd July 2022

*/
class Bud {
    constructor(x, y, offset) {
      this.pos = createVector(x, y)
      this.r = width/16
      this.ptsArr = []
      this.offset = offset
      this.rotrate = random(0.1, 1)
  
  
    }
  
    display() {
      push()
      translate(this.pos.x, this.pos.y)
      // scale(1, 0.5)
      beginShape()
      for (let i=0; i<numPetals; i++) {
    
        let theta = 360/numPetals * i
        let x = cos(frameCount*this.rotrate + theta + this.offset)
        let y = sin(frameCount*this.rotrate + theta + this.offset)
  
        this.ptsArr[i] = createVector(x, y)
  
        // if (debug) {
        //   strokeWeight(5)
        //   stroke(0)
        //   point(x, y)
        // }
      }
      endShape()
    
      pop()
    }
  }
  
  class Petal {
    constructor() {
      this.rotation;
      this.t
      this.tRate = random(0.1, 0.5)
      this.aOffset = random(360)
      this.size = height/32
      this.ctrlMag = random(height*.4, height*.7)
    }
  
    petal() {
      beginShape()
      vertex(-this.size, 0) // tip
      bezierVertex(
        0, -this.size,  
        this.size, -this.size,  
        this.size, 0   // base
      )
      bezierVertex(
        this.size, this.size, 
        0, this.size,  
        -this.size, 0   // tip
      )
        
      endShape(CLOSE)
    }
  
    display(i) {
      let c1 = buds[0].ptsArr[i].copy().setMag(this.ctrlMag)
      let c2 = buds[1].ptsArr[i].copy().setMag(this.ctrlMag)
  
      if (debug) {
        strokeWeight(2)
        let bezStroke = (sin(frameCount*0.7)*0.5+0.5)*50+127
        stroke(bezStroke)
        stroke(150)
        noFill()
        bezier(
          buds[0].pos.x, buds[0].pos.y,
          c1.x+buds[0].pos.x, c1.y+buds[0].pos.y,
          c2.x+buds[1].pos.x, c2.y+buds[1].pos.y,
          buds[1].pos.x, buds[1].pos.y,
        )
      }
  
      let a = 360/numPetals * i
      this.t = sin(frameCount*this.tRate+this.aOffset)*0.5+0.5
  
      let x = bezierPoint(
        buds[0].pos.x,
        c1.x+buds[0].pos.x,
        c2.x+buds[1].pos.x,
        buds[1].pos.x,
        this.t
      )
  
      let y = bezierPoint(
        buds[0].pos.y,
        c1.y+buds[0].pos.y,
        c2.y+buds[1].pos.y,
        buds[1].pos.y,
        this.t
      )
      
      push()
      translate(x, y);
      noStroke()
      fill(255)
      rotate(a+frameCount)
      petalShape(this.size)
      pop()
  
  
    }
  }
  
  function petalShape(size) {
    
    beginShape()
  
    // todo: implement twists on controls
    // let changerate = 0.0025
    // let sr = sin(frameCount*changerate+this.t*360) * size;
    // let cr = cos(frameCount*changerate+this.t*360) * size
  
    vertex(-size, 0) // tip
    bezierVertex(
      0, -size,  
      size, -size,  
      size, 0   // base
    )
    bezierVertex(
      size, size, 
      0, size,  
      -size, 0   // tip
    )
      
    endShape(CLOSE)
  }
let debug = false

let buds = []
let numPetals = 5
let petals = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)

  let numBuds = 2;
  for (let i=0; i<numBuds; i++) {
    let ymargin = 0.33
    let y = map(i, 0, numBuds-1, height*ymargin, height*(1-ymargin))
    let offset = map(i, 0, numBuds-1, 0, 180)
    buds.push(new Bud(width/2, y, offset))
  }

  for (let i=0; i<numPetals; i++) {
    petals.push(new Petal())
  }

  background(127);
}

function mousePressed() {
  debug = !debug
}

function draw() {
  // background(127, 50);
  background(127);


  for (bud of buds) {
    bud.display();
  }


  for (let i=0; i<petals.length; i++) {
    petals[i].display(i)
  }
}
