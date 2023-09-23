let shorter;
let numpets = 7;
let pets = [];
let angslice;
let trigger = 0;
let pettip;

function setup() {
  createCanvas(windowWidth, windowHeight);
	shorter = min(width, height);
  pixelDensity(1);

  angleMode(DEGREES);
	angslice = 360/numpets;
	pettip = shorter*.45;

  for (let i=0; i<numpets; i++) {
    pets.push(new Pet(i));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  shorter = min(width, height);
}

function draw() {
  background(127, 5);
  push();
  translate(width/2, height/2);
  for (let i=0; i<numpets; i++) {
    rotate(angslice);
    pets[i].run(i);
  }
	pop();
	
	print(pets[0].t1);
}

// petal class
class Pet {
  constructor(i) {
    this.s1, this.s2;
    this.x1, this.y1, this.x2, this.y2;
    this.off = angslice;
    this.order = true;
    this.pop = true;
    this.orderray = [
			[0, 0],
			[shorter*.15, 0], 
			[shorter*.15, shorter*.2], 
			[0, pettip]
		];
    this.chaosray1, this.chaosray2;
		this.popchaos();
		this.timer = 0;
  }

  // hidea
  // use dist of one bezierpoint() and the baseline to ...

  popchaos() {
    this.chaosray1 = [
			[random(-width, width), random(-height, height)], 
			[random(-width, width), random(-height, height)], 
			[random(-width, width), random(-height, height)],
			[0, pettip], 
		];
    this.chaosray2 = [
			[random(-width, width), random(-height, height)], 
			[random(-width, width), random(-height, height)], 
			[random(-width, width), random(-height, height)],
			[0, pettip], 
		];
  }

  time(rate) {
    return (cos(rate)+1)/2;
    // I use cos here because it starts at 1 after I add 1 and divide by 2
  }

  update() {
    this.s1 = frameCount;


		if (this.s1 % 360 == 0) { // have to figure out how to trigger this.order
      this.order = !this.order;
			if (!this.order) {
				this.popchaos();
			}
    }

		
		this.timer++;

		this.drawlines();
	}
	
	drawlines() {
    let t1 = this.time(this.s1);
		
    if (this.order) {
      this.x1 = bezierPoint(this.orderray[0][0], this.orderray[1][0], this.orderray[2][0], this.orderray[3][0], t1);
      this.y1 = bezierPoint(this.orderray[0][1], this.orderray[1][1], this.orderray[2][1], this.orderray[3][1], t1);
      this.x2 = bezierPoint(-this.orderray[0][0], -this.orderray[1][0], -this.orderray[2][0], -this.orderray[3][0], t1)
      this.y2 = bezierPoint(this.orderray[0][1], this.orderray[1][1], this.orderray[2][1], this.orderray[3][1], t1);
    } else {
      // chaosray
      this.x1 = bezierPoint(this.chaosray1[0][0], this.chaosray1[1][0], this.chaosray1[2][0], this.chaosray1[3][0], t1);
      this.y1 = bezierPoint(this.chaosray1[0][1], this.chaosray1[1][1], this.chaosray1[2][1], this.chaosray1[3][1], t1);
      this.x2 = bezierPoint(this.chaosray2[0][0], this.chaosray2[1][0], this.chaosray1[2][0], this.chaosray2[3][0], t1);
      this.y2 = bezierPoint(this.chaosray2[0][1], this.chaosray2[1][1], this.chaosray1[2][1], this.chaosray2[3][1], t1);
		}
	}

  draw() {
    (this.order) ? stroke(0, 255) : stroke(255, 255);

    line(this.x1, this.y1, this.x2, this.y2);
  }

  run() {
    this.update();
    this.draw();
  }
}

function mousePressed() {
	isLooping() ? noLoop() : loop();
}