/*
  Date: Saturday 8th October 2022

  variables:
    - c: petal density
    - petalDirection: petal fillDirection
    - swirlDirection: flower swirl fillDirection
    - flowerRotRate: flower rotation rate
    - bgA: background alpha
    - bgH: background colour
    - petalFillRate: petal fill colour change rate
    - petalStrokeColOffset: petal stroke offset
    - petalStrokeWeight: petal stroke weight
    - flowerForm: different petal size configurations:
      - modulus
      - trig
      - mapped distance from center
    - flowerFillReps: flower colour change rate
    - petalSizeRate: petal size change rate

*/


let petals = [];
let phyloAngle = 2.39982772149;
let sat = 50
let c, maxD, mod, ang, innerS, outerS, petalFillRate, petalStrokeRate, flowerFillReps, flowerStrokeReps, flowerRotRate, petalSizeRate, swirlDirection, petalDirection, flowerFillDirection, flowerStrokeDirection, bgA, petalStrokeWeight, flowerForm, shorter, fillLower, fillUpper, strokeLower, strokeUpper, petalForm, topScalar;


function setup() {
  shorter = min(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight)
  maxD = dist(0, 0, width/2, height/2);

  colorMode(HSB);

  fillLower = random(360)
  fillUpper = fillLower + random(360)
  strokeLower = random(360)
  strokeUpper = strokeLower + random(360)
  bgH = random(360);
  bgA = random(0.1);
  c = map(random(), 0, 1, shorter*0.04, shorter*0.08);
  mod = floor(random(5, 20));
  ang = random(0.01, 0.05);
  innerS = random(c);
  outerS = random(c);
  petalFillRate = random(0.001, 0.025);
  petalStrokeRate = random(0.001, 0.025);
  flowerFillReps = 1//random(3);
  flowerStrokeReps = random(3);
  flowerRotRate = random(-0.005, 0.005);
  petalStrokeWeight = random(5);
  flowerForm = floor(random(3));
  swirlDirection = random() > 0.5 ? -1 : 1;
  petalDirection = random() > 0.5 ? -1 : 1;
  flowerFillDirection = random() > 0.5 ? -1 : 1;
  flowerStrokeDirection = random() > 0.5 ? -1 : 1;
  petalForm = 3 //floor(random(3));
  petalSizeRate = 1 //random(1, 4);

  switch(petalForm) {
    case 0:   // petal
      topScalar = 1;
      break;
    case 1:   // lemon
      topScalar = 1.5;
      break;
    default:  // heart
      topScalar = 0.5;
      break;
  }

  console.log(`c: ${c}`);
  console.log(`mod: ${mod}`);
  console.log(`petalSizeRate: ${petalSizeRate}`);
  console.log(`innerS: ${innerS}`);
  console.log(`outerS: ${outerS}`);
  console.log(`abs(innerS-outerS): ${abs(innerS-outerS)}`);
  console.log(`ang: ${ang}`);
  console.log(`petalStrokeRate: ${petalStrokeRate}`);
  console.log(`petalFillRate: ${petalFillRate}`);
  console.log(`flowerFillReps: ${flowerFillReps}`);
  console.log(`flowerRotRate: ${flowerRotRate}`);
  console.log(`petalStrokeWeight: ${petalStrokeWeight}`);
  console.log(`flowerForm: ${flowerForm}`);
  console.log(`fillLower: ${fillLower}`);
  console.log(`fillUpper: ${fillUpper}`);
  console.log(`strokeLower: ${strokeLower}`);
  console.log(`strokeUpper: ${strokeUpper}`);
  console.log(`bgH: ${bgH}`);

  growPetals();

  background(bgH, sat, 100);
}


function growPetals() {  
  let n = 1;
  // distance from middle to corner
  let d;
  

  do {
    let r = c * sqrt(n);
    let a = n * phyloAngle;
    let x = r * cos(a);
    let y = r * sin(a);


    d = dist(0, 0, x, y);

    // determines starting colour petal
    // let fillOffset = map(d, 0, maxD, 0, 360*flowerFillReps);
    let fillOffset = map(d, 0, maxD, 0, flowerFillReps);
    let fillDirection;
    let fillT;
    if (floor(fillOffset%2) == 0) {
      fillT = fillOffset%1
      fillDirection = 1
    } else {
      fillT = 1 - fillOffset%1
      fillDirection = -1
    }
    fillDirection *= flowerFillDirection



    let strokeOffset = map(d, 0, maxD, 0, flowerStrokeReps);
    let strokeDirection;
    let strokeT;
    if (floor(strokeOffset%2) == 0) {
      strokeT = strokeOffset%1
      strokeDirection = 1
    } else {
      strokeT = 1 - strokeOffset%1
      strokeDirection = -1
    }
    strokeDirection *= flowerStrokeDirection




    let sizeOffset;

    switch (flowerForm) {
      case 0:
        // using modular to determine size
        sizeOffset = map(n%mod, 0, mod, innerS, outerS);
        break;

      case 1:
        // using trig to determine size
        sizeOffset = map(sin(n*ang), -1, 1, innerS, outerS);
        break;

      default:
        // using dist to determine size
        sizeOffset = map(d, 0, maxD, innerS, outerS);
        break;
    }

    petals.push(new Petal(x, y, sizeOffset, fillT, fillDirection, strokeT, strokeDirection, n));

    n++;

    
  } while (d < maxD + outerS);

  console.log(`n: ${n}`);

}




function draw() {
  background(bgH, sat, 80, bgA);
  drawPetals();
}





function drawPetals() { 
  push();
  translate(width/2, height/2);
  rotate(frameCount*flowerRotRate);
  for (petal of petals) {
    petal.run();
  }
  pop();
}





class Petal {
  constructor(x, y, sizeOffset, fillT, fillDirection, strokeT, strokeDirection, n) {
    this.pos = createVector(x, y)
    this.sizeOffset = sizeOffset;
    this.size = this.sizeOffset;
    this.rot = 0;
    this.fillT = fillT;
    this.fill;
    this.fillDirection = fillDirection;
    this.strokeT = strokeT;
    this.stroke;
    this.strokeDirection = strokeDirection;
    this.n = n;
  }

  calcFill() {
    if (this.fillT < 0) {
      this.fillDirection = 1
      this.fillT = 0
    }
    
    if (this.fillT > 1) {
      this.fillDirection = -1
      this.fillT = 1
    }
    
    this.fillT += petalFillRate*this.fillDirection
    this.fill = lerp(fillLower, fillUpper, this.fillT)
    this.fill %= 360
  }

  calcStroke() {
    if (this.strokeT < 0) {
      this.strokeDirection = 1
      this.strokeT = 0
    }
    
    if (this.strokeT > 1) {
      this.strokeDirection = -1
      this.strokeT = 1
    }
    
    this.strokeT += petalStrokeRate*this.strokeDirection
    this.stroke = lerp(strokeLower, strokeUpper, this.strokeT)
    this.stroke %= 360
  }


  calcSize() {
    switch (flowerForm) {
      case 0:
        // using modular to determine size
        this.size = map(abs(this.n)%mod, 0, mod-1, innerS, outerS);
        this.n += abs(petalDirection);
        break;

      case 1:
        // using trig to determine size
        this.size = map(sin(this.n*ang), -1, 1, innerS, outerS);
        this.n+=petalSizeRate;
        break;

      default:
        // using dist to determine size
        break;
    }
  }

  update() {
    // calc rotation
    this.rot += phyloAngle;

    this.calcFill();
    this.calcStroke();
    
    // calc size
    this.calcSize();
  }

  display() {
    push();

    strokeWeight(petalStrokeWeight);
    stroke(this.stroke, 50, 80);

    flowerForm == 0 ? rotate(this.rot) : rotate(this.rot * swirlDirection);
    

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.pos.heading());

    fill(this.fill, sat, 80);

    beginShape();
    scale(petalDirection);
    bezCircle(4, this.size);
    endShape();

    pop();

    pop();
  }

  run() {
    this.update();
    this.display();
  }
}






// code from 221015_petal
// fillDirection parameter determines if drawn clockwise of anti-clockwise
function bezCircle(circPoints, radius) {
  // used to store previous anchor/control points as we iterate through the for-loop
  let a1, c1;
  
  for (let i=0; i<=circPoints; i++) {
    let theta = TAU/circPoints * i;
    let x = cos(theta) * radius;
    let y = sin(theta) * radius;

    // following formula taken from https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
    let c = 4/3 * tan(PI/(2*circPoints)) * radius;
    
    let vxy = createVector(x, y);
    let vc1 = createVector(c, 0);
    
    // make vc1 heading normal to vxy
    vc1.setHeading(vxy.heading()+TAU/4);
    
    // get flipped version of vc1 to get other normal vector of vxy
    let vc2 = vc1.copy().mult(-1);
    
    // get vector from origin to c1 and c2
    let vcxy1 = vc1.add(vxy);
    let vcxy2 = vc2.add(vxy);
  
    let botScalar = 1.5;


    // at the first point
    if (i==0) { 
      // used when i==circPoints
      a1 = vxy.mult(botScalar);
      vertex(a1.x, a1.y);

    // at the last point, finish at a1
    } else if (i==circPoints) {  
      bezierVertex(
        c1.x,     c1.y,
        vcxy2.x,  vcxy2.y,
        a1.x,     a1.y
      );

    } else if (i==2) {  
      vxy.mult(topScalar);
      bezierVertex(
        c1.x,     c1.y,
        vcxy2.x,  vcxy2.y,
        vxy.x,     vxy.y
      );

    // at all other points
    } else {  
      bezierVertex(
        c1.x,     c1.y,
        vcxy2.x,  vcxy2.y,
        vxy.x,    vxy.y
      );
    }

    // store into c1 for next for-loop iteration
    c1 = createVector(vcxy1.x, vcxy1.y);
  }
}