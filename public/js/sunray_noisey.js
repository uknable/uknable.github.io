/*

  Date: 3rd December 2022

  I'm revisiting this sketch after successfully storing positions in an array sequentially(? not sure of the right word) every frame to create a trail of squares. Maybe I can apply that technique to this.
*/

let lines = [];
let linesNum = 1000;

let len;
let lenUpper;
let lenInit;
let lenInc;
let lenOscRange;
let lenNoiseRange;

let rotation;
let rotateUpper;
let rotateInit;
let rotateInc;
let rotateOscRange;
let rotateNoiseRange;

let oscInit; 
let oscRate;

function setup() {
  createCanvas(windowWidth, windowHeight); 

  colorMode(HSB);
  angleMode(DEGREES);


  colour = color(60, 100, 100, .1);

  
  ////////////////////////////////////
  // PROPERTIES FOR LENGTH OF THE RAY
  ////////////////////////////////////

  len;
  lenUpper = width/7;
  lenInit = random(lenUpper, lenUpper/2);
  lenInc = .03;
  lenOscRange = lenUpper/2;
  lenNoiseRange = 50;

  //////////////////////////////////////
  // PROPERTIES FOR ROTATION OF THE RAY
  //////////////////////////////////////

  rotation;
  rotateUpper = 80;
  rotateInit = 180;
  rotateInc = .04;
  rotateOscRange = 50;
  rotateNoiseRange = 50;

  //////////////////////////////////////
  // PROPERTIES FOR OSCILLATION
  //////////////////////////////////////

  oscInit = 270; 
  oscRate = 1.5;

  background(0, 0, 0);

}

function draw() {
  background(0, 0, 0);


  // the oscRate is doubled to make the length oscillate twice as fast as the rotation
  // meaning the y oscillates twice as fast as the x so achieve the infinity pattern
  const lenOsc = cos(oscInit + frameCount*oscRate*2);
  len = lenInit + 
    noise(frameCount*0.002)*lenNoiseRange + 
    map(lenOsc, -1, 1, -lenOscRange, lenOscRange);

  
  const rotateOsc = cos(oscInit + frameCount*oscRate);
  rotation = 
    noise(frameCount*0.01)*rotateNoiseRange + 
    map(rotateOsc, -1, 1, rotateUpper - rotateOscRange, rotateUpper);


  // The upper range of the rotation is incremented
  // the range is kept the same through rotateOscRange
  rotateUpper+=oscRate*rotateInc;


  // The initial length of the ray is incremented
  lenInit+=oscRate*lenInc;



  lines.push(new Line(len, rotation))
  if (lines.length > linesNum) lines.shift()



  for (let i=0; i<lines.length; i++) {
    lines[i].run();
  }

  
}



class Line {
  constructor(len, rotation) {
    this.pos = createVector(width/2, height/2);
    this.len = len;
    this.rotation = rotation;
  }

  update() {
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    stroke(colour);
    line(0, 0, this.len, 0);
    pop();
  }

  run() {
    this.update();
    this.display();
  }
  
}
