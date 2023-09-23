let agents = [];
let agentsNum = 500;

function setup() {
  createCanvas(windowWidth, windowHeight);

  colorMode(HSB);
  angleMode(DEGREES);
  // blendMode(MULTIPLY);
  for (let i=0; i<agentsNum; i++) {
    agents[i] = new Agent();
  }
}

function draw() {
  // background(0, 0, 100, 0.1);

  for (let i=0; i<agentsNum; i++) {
    agents[i].run();
  }
  
}

class Agent {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector();
    this.acc = createVector();
    this.size = random(5, 25);
    this.len = map(this.size, 5, 20, width/16, width/8);
    this.rotateOffset = random(360);
    this.rotateSpeed = random(-1 , 1);
    this.colour = color(random(150, 300), 100, random(70, 100));
  }


  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotateOffset + frameCount*this.rotateSpeed);
    stroke(this.colour);
    // ellipse(0, 0, this.size);
    line(0, 0, this.len, 0);
    pop();
  }

  run() {
    this.display();
  }
  
}