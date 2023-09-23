/*  
    This sketch uses points on two the bezier lines that form the shape of a petal
    to draw a line. The line moves around the inside of the petal shape to imply
    its shape. 
*/

// shorter is the universal variable that scales the scene
let shorter;

// number of petals
let nPetals;

// staggered animation?
let staggered = false;

// holds class instances
let petals = [];

let oscRate1, oscRate2;
let oscTrack1, oscTrack2;


function setup() {
  createCanvas(windowWidth, windowHeight);
  shorter = min(width, height);

  // I think I set pixelDensity() to 1 so that the sketch draws consistently across different resolutions
  pixelDensity(1);
  // blendMode(ADD);
  strokeWeight(random(1, 7));

  angleMode(DEGREES);
  
  // if (random() > 0.5) staggered = false;

  nPetals = int(random(5, 14));
  const angleSlice = 360/nPetals;
  oscRate1 = random(1, 2);
  oscRate2 = random(1, 2);

  for (let i=0; i<nPetals; i++) {
    const angle = angleSlice*i;

    let stagger = 0;
    if (staggered) stagger = angle;

    petals.push(new Petal(width/2, height/2, oscRate1, oscRate2, angle, stagger));
  }

  background(255);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  shorter = min(width, height);
}

function draw() {
  background(255, 10);


  for (let i=0; i<nPetals; i++) {

    petals[i].run();
  }
}

class Petal {
  constructor(x, y, s1, s2, rot, stagger) {
    this.s1 = s1;
    this.s2 = s2;
    this.rotation = rot;
    this.left = createVector();
    this.right = createVector();
    this.pos = createVector(x, y);
    this.stagger = stagger;
  }

  calculatePoints() {
    this.left.x = bezierPoint(0, shorter*.15, shorter*.15, 0, -cos(this.stagger+frameCount*this.s1)/2+.5);
    this.left.y = bezierPoint(0, 0, shorter*.2, shorter*.4, -cos(this.stagger+frameCount*this.s1)/2+.5);
    
    this.right.x = bezierPoint(0, -shorter*.15, -shorter*.15, 0, -cos(this.stagger+frameCount*this.s2)/2+.5);
    this.right.y = bezierPoint(0, 0, shorter*.2, shorter*.4, -cos(this.stagger+frameCount*this.s2)/2+.5);
  }

  calculateRotation() {
    this.rotation++;
  }

  draw() {
    push();

    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);

    stroke(120);
    line(this.left.x, this.left.y, this.right.x, this.right.y);

    pop();
  }

  run() {
    this.calculatePoints();
    this.calculateRotation();
    this.draw();
  }
}

// draws outline
function outline() {
  noFill();
  stroke(120);

  half();
  scale(-1, 1);
  half();
}

// half petal
function half() {
  bezier(
    0, 0,
    shorter*.15, 0,
    shorter*.15, shorter*.2,
    0, shorter*.4,
  )
}