/*
  This sketch was written from 19th May 2022 and got to a nice stage on 22nd May 2022
  I wrote this sketch after I played around with a line drawn from the center of the canvas to my mouse position during the second-last class of teaching DECO1012 in 2022 semester 1
  I was swirling it around in a infinity pattern and thought it looked nice
*/

let agents = [];
let agentsNum = 1;

function setup() {
  createCanvas(windowWidth, windowHeight); 

  colorMode(HSB);
  angleMode(DEGREES);

  for (let i=0; i<agentsNum; i++) {
    agents[i] = new Agent();
  }

  background(0, 0, 0);

  // noLoop(); // For recording purposes because premiere
}

function mousePressed() { 
  loop();   // For recording purposes
}

function draw() {
  // background(0, 0, 100, 0.01);

  for (let i=0; i<agentsNum; i++) {
    agents[i].run();
  }
  
}



class Agent {
  constructor() {
    // this.pos = createVector(random(width), random(height));
    this.pos = createVector(width/2, height/2); // test
    this.colour = color(150, 100, 100, .2);
    this.noiseOffset = random(100);

    ////////////////////////////////////
    // PROPERTIES FOR LENGTH OF THE RAY
    ////////////////////////////////////

    this.len;
    this.lenUpper = min(windowWidth, windowHeight)/7;
    this.lenInit = random(this.lenUpper, this.lenUpper/2);
    this.lenInc = .03;
    this.lenOscRange = this.lenUpper/2;
    this.lenNoiseRange = 50;

    //////////////////////////////////////
    // PROPERTIES FOR ROTATION OF THE RAY
    //////////////////////////////////////

    this.rotation;
    this.rotateUpper = 80;
    this.rotateInit = 180;
    this.rotateInc = .04;
    this.rotateOscRange = 70;
    this.rotateNoiseRange = 50;
    
    //////////////////////////////////////
    // PROPERTIES FOR OSCILLATION
    //////////////////////////////////////

    this.oscInit = 270; 
    this.oscRate = 1;

  }

  update() {
    // the oscRate is doubled to make the length oscillate twice as fast as the rotation
    // meaning the y oscillates twice as fast as the x so achieve the infinity pattern
    const lenOsc = cos(this.oscInit+frameCount*this.oscRate*2);
    this.len = this.lenInit + 
      // noise(this.noiseOffset+frameCount*0.002)*this.lenNoiseRange + 
      map(lenOsc, -1, 1, -this.lenOscRange, this.lenOscRange);

    const rotateOsc = cos(this.oscInit+frameCount*this.oscRate);
    this.rotation = 
      // noise(this.noiseOffset+frameCount*0.005)*this.rotateNoiseRange + 
      map(rotateOsc, -1, 1, this.rotateUpper - this.rotateOscRange, this.rotateUpper);

    // The upper range of the rotation is incremented
    // the range is kept the same through this.rotateOscRange
    this.rotateUpper+=this.oscRate*this.rotateInc;

    // The initial length of the ray is incremented
    this.lenInit+=this.oscRate*this.lenInc;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotateInit + this.rotation);
    stroke(this.colour);
    line(0, 0, this.len, 0);
    pop();

  }

  run() {
    this.update();
    this.display();
  }
  
}