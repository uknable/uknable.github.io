let shorter, sclera, iris, ctrl1, ctrl2, pupil;
let bezs = 100;
let bezArray = [];
let angleOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  angleMode(DEGREES);
  shorter = min(width, height);

  getMeasures();
  initBezArray();
}

function draw() {
  background(125);

  fill(255);
  noStroke();
  ellipse(width/2, height/2, sclera);

  fill('green');
  ellipse(width/2, height/2, iris);


  for (let i=0; i<bezArray.length; i++) {
    bezArray[i].run();
  }

  fill('black');
  noStroke();
  ellipse(width/2, height/2, pupil);

  // angleOffset += 0.1;
}

class Bezier {
  constructor(a1, c1, c2, a2, angle, i) {
    this.a1 = createVector(a1.x, a1.y);
    this.c1 = createVector(c1.x, c1.y);
    this.c2 = createVector(c2.x, c2.y);
    this.a2 = createVector(a2.x, a2.y);
    this.angle = angle;
    this.i = i;
    this.bezFill = color(0, random(0, 255), 0);
    this.xOffset = random(pupil, sclera);
  }

  draw() {
    push();
    translate(width/2, height/2);
    rotate(this.angle + angleOffset);
    fill(this.bezFill);
    noStroke();
    bezier(
      this.a1.x, this.a1.y,
      this.c1.x, this.c1.y,
      this.c2.x, this.c2.y,
      this.a2.x, this.a2.y
    );

    // const angleMap = map(this.i, 0, bezs, 0, 360);
    // const t = map(sin(angleMap + angleOffset), -1, 1, 0, 1);
    // const x = bezierPoint(this.a1.x, this.c1.x, this.c2.x, this.a2.x, t);
    // const y = bezierPoint(this.a1.y, this.c1.y, this.c2.y, this.a2.y, t);
    // fill('green');
    // noStroke();
    // ellipse(x, y, 5);

    pop();
  }

  update() {
    this.c2.x = -sin(frameCount*0.5) * this.xOffset;
    this.c1.x = sin(frameCount*0.5) * this.xOffset;
    this.c1.y = -sin(frameCount*0.5) * pupil/2;
    this.c2.y = sin(frameCount*0.5) * pupil/2;
  }

  run() {
    this.draw();
    this.update();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  shorter = min(width, height);

  getMeasures();
  initBezArray();
}

function initBezArray() {
  for (let i=0; i<bezs; i++) {
    const angle = 360/bezs * i;
    bezArray[i] = new Bezier(
      createVector(iris/2, 0), 
      createVector(ctrl1/2, 0), 
      createVector(ctrl2/2, 0), 
      createVector(pupil/2, 0), 
      angle,
      i
    );
  }
}

function getMeasures() {
  sclera = shorter*0.95;
  iris = sclera*0.7;
  ctrl1 = iris*0.7;
  ctrl2 = ctrl1*0.7;
  pupil = ctrl2*0.7;
}