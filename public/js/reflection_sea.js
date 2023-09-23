const maxFrameRate = 10;
let shorter;

let reflection;
let rectsArray = [];
let starsArray = [];
let cloudsArray = [];
let maxStars;

let skyColour, colourNight, colourDay;
let moonPos;
let time;
let boat;

let tracker = 0;
let trackRight = true;
let play = false;

function setup() {
	pixelDensity(1);
	frameRate(maxFrameRate);

	createCanvas(windowWidth, windowHeight);

	shorter = min(width, height);
	noStroke();

	const nightDivisor = 2;
	colourNight = color(random(255)/nightDivisor, random(255)/nightDivisor, random(255)/nightDivisor);
	colourDay = color(random(255), random(255), random(255));
	skyColour = colourNight;

	reflection = createGraphics(windowWidth, windowHeight / 2);
	reflection.noStroke();
	reflection.background(colourNight);

	// stars
	maxStars = int(shorter)*2;
	for (let i = 0; i<maxStars; i++) {
		starsArray.push(new Star(random(width), random(height/2)));
	}

	// clouds
	const clouds = 7;
	for (let i=0; i<clouds; i++) {
		cloudsArray.push(new Cloud(random(0, width-shorter/5)));
	}

	moonPos = createVector(mouseX, mouseY);

	boat = new Boat();

}

function draw() {
	// sky colour
	background(skyColour);


	// stars
	for (let i = 0; i < starsArray.length; i++) {
		starsArray[i].run();
		if (starsArray.length > maxStars && starsArray[i].radius - starsArray[i].size <= starsArray[i].radius/10) {
			starsArray.splice(i, 1);
		}
	}

	if (starsArray.length < maxStars) {
		starsArray.push(new Star(random(width), random(height/2)));
	}



	// moon/sun
	// lerp for smooth movement
	if (play) {
		if (trackRight) {
			tracker += 0.002;
		} else {
			tracker -= 0.002;
		}

		if (tracker >= 1) trackRight = false;
		if (tracker <= 0) trackRight = true;

		moonPos.x = lerp(0, width, tracker);
	} else {
		moonPos.x = lerp(moonPos.x, mouseX, 0.05);
	}
	const mappedMouseX = map(moonPos.x, 0, width, 0, PI);
	time = sin(mappedMouseX);
	const mappedY= map(time, 0, 1, height/1.5, height/4);
	moonPos.y = mappedY;

	const moon = new Moon(moonPos);
	moon.run();


	// clouds
	if (cloudsArray) {

		for (let i=0; i<cloudsArray.length; i++) {
			if(cloudsArray[i].pos.x > width+shorter/10) {
				cloudsArray.splice(i, 1, new Cloud(0));
			} else {
				cloudsArray[i].run();
			}
	
		}
	}


	// update skyColour
	skyColour = lerpColor(colourNight, colourDay, time);


	loadPixels(); // for reflection to use



	/*      REFLECTION      */


	const rects = 500;
	const boatRects = 10;

	for (let i = 0; i < rects; i++) {
		if (i >= rects - boatRects) {
			const x = random(-boat.size/2, boat.size/2);
			const y = random(-boat.size/2, boat.size/4)+boat.size/4 + boat.bob;

			rectsArray.push(new ReflectRect(boat.pos.x+x, height - boat.pos.y+y, boat.colour));

		} else {
			const randx = int(random(width));
			const randy = int(random(height));
			const randPixel = (randx + width * randy) * 4;
			const colour = [pixels[randPixel], pixels[randPixel + 1], pixels[randPixel + 2]];

	
			rectsArray.push(new ReflectRect(randx, height / 2 - randy, colour));
		}

	}

	for (let i = 0; i < rectsArray.length; i++) {
		rectsArray[i].run();

		if (rectsArray.length >= 2000) {
			rectsArray.splice(0, 1);
		}
	}

	image(reflection, 0, height / 2);


	// boat
	boat.run();

	const d = dist(moonPos.x, moonPos.y, mouseX, mouseY);
	if (d <= moon.size/2) {
		cursor(HAND);
		if(mouseIsPressed) {
			playTrack();
		}
	} else {
		cursor(ARROW);
	}
}

/*      CLASSES      */

class Cloud {
	constructor(x) {
		const minSize = shorter/30;
		const maxSize = shorter/10;
		this.pos = createVector(x-maxSize, random(maxSize, height/2-minSize));
		this.size = random(minSize, maxSize);
		this.length = random(this.size, this.size*2);
		this.speed = map(this.size, minSize, maxSize, 1.2, 4.5);
		this.colourDay = color(red(colourDay)*1.5, green(colourDay)*1.5, blue(colourDay)*1.5);
		this.colourNight = color(red(colourNight)/1.5, green(colourNight)/1.5, blue(colourNight)/1.5);
		this.colour = this.colourNight;
	}

	draw() {
		fill(this.colour);
		noStroke();
		ellipse(this.pos.x-this.length/2, this.pos.y, this.size);
		rect(this.pos.x-this.length/2, this.pos.y-this.size/2, this.length, this.size);
		ellipse(this.pos.x+this.length/2, this.pos.y, this.size);
	}

	update() {
		this.pos.x+=this.speed;
		this.colour = lerpColor(this.colourNight, this.colourDay, time);
	}

	run() {
		this.draw();
		this.update();
	}
}


class Boat {
	constructor() {
		this.colour = [0, 0, 0];
		this.bob = sin(frameCount*0.07) * 5;
		this.pos = createVector(width/2, 3*height/4);
		this.size = shorter/20; // shorter/20;
		this.bodyOffX = map(moonPos.x, 0, width, this.size/3, -this.size/3);
		this.bodySize = this.size/1.5;
		this.headSize = this.size/1.5;
		this.iSize = this.headSize/4;
		this.iClose = map(time, -1, 1, 3, 1.2);
		this.iOffX = map(moonPos.x, 0, width, -this.iSize/3, this.iSize/3);
		this.pupilSize = this.iSize/1.4;
		this.pupilOffY = map(time, -1, 1, this.iSize/9, -this.iSize/9);
		this.pupilOffX = map(moonPos.x, 0, width, -this.iSize/9, this.iSize/9);
		this.iLidOffY = map(time, -1, 1, -this.iSize/3, this.iSize/3);
		this.nodOff = map(moonPos.x, 0, width, -PI, PI);
		this.bodyOffY = map(moonPos.x, 0, width, -this.size/4, this.size/4);
		this.headOffY = map(time, 1, -1, -this.size/8, this.size/2);
		this.iOffY = map(time, 1, -1, -this.size/16, this.size/2);
	}

	draw() {
		fill(this.colour);
		noStroke();

		// boat
		beginShape();
		vertex(this.pos.x - this.size, this.pos.y - this.size/2);
		bezierVertex(
			this.pos.x-this.size/1.5, this.pos.y-this.size/1.5, 
			this.pos.x+this.size/1.5, this.pos.y-this.size/1.5, 
			this.pos.x + this.size, this.pos.y - this.size/2
		);
		vertex(this.pos.x + this.size/2, this.pos.y);
		vertex(this.pos.x - this.size/2, this.pos.y);
		endShape();

		// front headpiece
		quad(
			this.pos.x-this.size/1, this.pos.y-this.size/1.45,
			this.pos.x-this.size/0.8, this.pos.y-this.size/1.4,
			this.pos.x-this.size/1.5, this.pos.y,
			this.pos.x, this.pos.y
		);

		// back headpiece
		quad(
			this.pos.x+this.size/1, this.pos.y-this.size/1.45,
			this.pos.x+this.size/0.8, this.pos.y-this.size/1.4,
			this.pos.x+this.size/1.5, this.pos.y,
			this.pos.x, this.pos.y
		);


		// body
		ellipse(this.pos.x+this.bodyOffX, this.pos.y+this.bodyOffY-this.size/2.5, this.bodySize, this.bodySize/1.5);

		push();
		translate(this.pos.x, this.pos.y);
		rotate(this.nodOff);

		// head
		ellipse(this.bodyOffX, -this.size+this.headOffY, this.headSize/1.1, this.headSize);

		// eyes;
		fill(255);
		ellipse(+this.bodyOffX+this.iOffX-this.iSize/1.5, -this.size+this.iOffY, this.iSize, this.iSize/this.iClose);
		ellipse(this.bodyOffX+this.iOffX+this.iSize/1.5, -this.size+this.iOffY, this.iSize, this.iSize/this.iClose);

		fill(this.colour);

		// eyelids
		const eyelidSize = 1.1;
		ellipse(this.bodyOffX+this.iOffX-this.iSize/1.5, this.iLidOffY-this.size+this.iOffY, this.iSize*eyelidSize, this.iSize/this.iClose*eyelidSize);
		ellipse(this.bodyOffX+this.iOffX+this.iSize/1.5, this.iLidOffY-this.size+this.iOffY, this.iSize*eyelidSize, this.iSize/this.iClose*eyelidSize);

		// pupils
		ellipse(this.bodyOffX+this.iOffX+this.pupilOffX-this.iSize/1.5, this.pupilOffY-this.size+this.iOffY, this.pupilSize/1.2, this.pupilSize)
		ellipse(this.bodyOffX+this.iOffX+this.pupilOffX+this.iSize/1.5, this.pupilOffY-this.size+this.iOffY, this.pupilSize/1.2, this.pupilSize);

		pop();
	}

	update() {
		this.bodyOffX = map(moonPos.x, 0, width, this.size/3, -this.size/3);
		this.iClose = map(time, -1, 1, 3, 1.2);
		this.iOffX = map(moonPos.x, 0, width, -this.iSize/3, this.iSize/3);
		this.pupilOffY = map(time, -1, 1, this.iSize/10, -this.iSize/10);
		this.pupilOffX = map(moonPos.x, 0, width, -this.iSize/9, this.iSize/9);
		this.iLidOffY = map(time, -1, 1, this.iSize/1.5, -this.iSize/1.5);
		this.nodOff = map(moonPos.x, 0, width, PI/10, -PI/10);
		this.bodyOffY = map(time, 1, -1, -this.size/8, this.size/2);
		this.headOffY = map(time, 1, -1, -this.size/32, this.size/2);
		this.iOffY = map(time, 1, -1, -this.size/8, this.size/2);
	}


	run() {
		this.draw();
		this.update();
	}
}

class ReflectRect {
	constructor(x, y, colourArray) {
		// as the rect is closer to the bottom, it is bigger, moves faster and is darker colour
		this.pos = createVector(x, y);
		this.speed = map(y, 0, height, shorter*0.0025, shorter*0.015);
		this.size = map(y, 0, height, shorter*0.01, shorter*0.03);
		this.colourCoeff = map(y, 0, height, 1.1, 1.7);

		// for consistency on the sides
		this.pos.x = map(this.pos.x, 0, width, -this.size/2, width+this.size/2)

		const roll = random();
		if (roll < 0.1) { // sometimes will draw blue rectangles, the same colour as the sky
			this.colour = skyColour;
		} else {
			this.colour = color(colourArray[0] / this.colourCoeff, colourArray[1] / this.colourCoeff, colourArray[2] / this.colourCoeff);
		}
	}

	draw() {
		reflection.rectMode(CENTER);
		reflection.fill(this.colour);
		reflection.noStroke();
		reflection.rect(this.pos.x, this.pos.y, this.size, this.size / 3);
	}

	update() {
		this.pos.add(createVector(this.speed, 0)); // move toward the right to simulate moving sea
	}

	run() {
		this.draw();
		this.update();
	}
}

class Star {
	constructor(x, y) {
		this.maxRadius = shorter*0.01;
		this.loc = createVector(x/width, y/height);
		this.pos = createVector(x, y);
		this.blinkSpeed = random(0.1);
		this.radius = int(random(this.maxRadius));
		this.size = sin(frameCount * this.blinkSpeed) * this.radius;
		this.disappear = this.radius/this.maxRadius;
	}

	draw() {
		const mappedTime = map(time, 0, this.disappear, 255, 0);

		fill(255, mappedTime);
		noStroke();
		ellipse(this.pos.x, this.pos.y, this.size);
	}

	update() {
		this.maxRadius = shorter*0.01;
		this.size = sin(frameCount * this.blinkSpeed) * this.radius; 
	}

	run() {
		this.draw();
		this.update();
	}
}

class Moon {
	constructor(moonPosVector) {
		this.size = shorter / 6;
		this.pos = createVector(moonPosVector.x, moonPosVector.y);
		this.colour = color(red(colourDay)*3, green(colourDay)*3, blue(colourDay)*3);
	}

	draw() {
		fill(this.colour);
		noStroke();
		ellipse(this.pos.x, this.pos.y, this.size);
	}

	update() {

	}

	run() {
		this.draw();
		this.update();
	}
}

function playTrack() {
	tracker = moonPos.x/width;
	play=!play;

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	shorter = min(width, height);
	
	reflection = createGraphics(windowWidth, windowHeight / 2);
	reflection.background(colourNight);

	boat = new Boat();


	maxStars = int(shorter)*2;
	for (let i=0; i<starsArray.length; i++) {
		starsArray[i].pos = createVector(starsArray[i].loc.x * width, starsArray[i].loc.y * height);
	}
}