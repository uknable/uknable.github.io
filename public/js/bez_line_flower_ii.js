/*  
    This sketch uses points on two the bezier lines that form the shape of a petal
    to draw a line. The line moves around the inside of the petal shape to imply
    its shape. 
*/

// shorter is the universal variable that scales the scene
let shorter;

// number of petals
let nPetals, nPetalSlice, incPetalSlice;

// staggered animation?
let staggered = false;

// holds class instances
let petals = [];

let oscRate1, oscRate2;
let oscTrack1, oscTrack2;
let colourRange, colourA, colourB, colourInc;
let strokeWeightA, strokeWeightB;

let posOffset;
let rotationRate;

function setup() {
  createCanvas(windowWidth, windowHeight);
  shorter = min(width, height)*1.5;

  // noLoop();

  // I think I set pixelDensity() to 1 so that the sketch draws consistently across different resolutions
  pixelDensity(1);
  // blendMode(ADD);
  strokeWeightA = random(1, 5);
  strokeWeightB = random(5, 10);

  posOffset = random(shorter/100);
  rotationRate = random(.1, 1);

  angleMode(DEGREES);
  colorMode(HSB);

  colourRange = 100;
  colourA = random(360);
  colourB = (colourA+colourRange) % 360;
  colourInc = random(0.1, 1);
  
  // if (random() > 0.5) staggered = false;

  nPetals = int(random(5, 14));
  nPetalSlice = int(random(3, 50));
  incPetalSlice = int(random(3, nPetalSlice)/2);
  // incPetalSlice = int(2);


  const angleSlice = 360/nPetals;
  oscRate1 = random(1, .5);
  oscRate2 = random(1, .5);

  // console.log(oscRate1, oscRate2);

  for (let i=0; i<nPetals; i++) {
    const angle = angleSlice*i;

    let stagger = 0;
    if (staggered) stagger = angle;

    petals.push(new Petal(width/2, height/2, oscRate1, oscRate2, angle, stagger, nPetalSlice));
  }

  background(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  shorter = min(width, height);

  for (let i=0; i<nPetals; i++) {
    petals[i].pos = createVector(width/2, height/2);
  }

}

function draw() {
  background(0, 0, 0, 0.01);


  for (let i=0; i<nPetals; i++) {

    petals[i].run();
  }

  
  // colourA += colourInc;
  colourA %= 360;
  colourB = colourA + colourRange;
  // if (colourA > colourB) {
  //   colourA = 0;
  // }
  // colour issue happens B < A and it tries to lerpColor, resulting in a rainbow
}

function mousePressed() {
  console.log(colourA, colourB, colourRange);
  loop(); 
}

class Petal {
  constructor(x, y, s1, s2, rot, stagger, petalSlice) {
    this.s1 = s1;
    this.s2 = s2;
    this.rotation = rot;
    this.left = createVector();
    this.right = createVector();
    this.pos = createVector(x, y);
    this.stagger = stagger;
    this.petalSlice = petalSlice;
  }

  calculatePoints() {
    this.left.x = bezierPoint(posOffset, shorter*.15, shorter*.15, posOffset, -cos(this.stagger+frameCount*this.s1)/2+.5);
    this.left.y = bezierPoint(0, 0, shorter*.2, shorter*.4, -cos(this.stagger+frameCount*this.s1)/2+.5);
    
    this.right.x = bezierPoint(posOffset, -shorter*.15, -shorter*.15, posOffset, -cos(this.stagger+frameCount*this.s2)/2+.5);
    this.right.y = bezierPoint(0, 0, shorter*.2, shorter*.4, -cos(this.stagger+frameCount*this.s2)/2+.5);
  }

  calculateRotation() {
    this.rotation+=rotationRate;
  }

  drawLineSegments(segments) {
    let inc = 1/segments;
    for (let i=0; i<segments; i+=incPetalSlice) {
      let a = inc * i;
      let x1 = lerp(this.left.x, this.right.x, a);
      let y1 = lerp(this.left.y, this.right.y, a);
      a = inc * (i+1);
      let x2 = lerp(this.left.x, this.right.x, a);
      let y2 = lerp(this.left.y, this.right.y, a);

      
      let colour = lerpColor(
        color(colourA, 100, 100),
        color(colourB, 100, 100),
        a
      );
      let strokeW = lerp(strokeWeightA, strokeWeightB, a);

      stroke(colour);
      strokeWeight(strokeW);
      line(x1, y1, x2, y2);
    }
  }


  draw() {
    push();

    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);

    // stroke(120);

    this.drawLineSegments(this.petalSlice);

    // line(this.left.x, this.left.y, this.right.x, this.right.y);

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