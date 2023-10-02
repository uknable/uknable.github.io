/*
    combining both timer and mirror branches of lerp_phyllotaxis
    really nice effect
    gives the illusion that it's shrinking as the petals are being added
*/

let shorter;

let n = 1000;
let petalsNum = n;
let c = 7;
let phyloAngle = 137.5;
let mirrorNum = 5;

let petals = [];
let size = 5;
let lerpRate = 0.001;
let petalCD = 30;
let currentTime = 0;

class Petal {
    constructor(x, y) {
        // ideally I would use a vector for pos but I don't know the syntax
        this.x = 0;
        this.y = 0;
        this.target = createVector(x, y);
        this.lerpTrack = 0;
    }

    update() {
        this.x = lerp(this.x, this.target.x, this.lerpTrack);
        this.y = lerp(this.y, this.target.y, this.lerpTrack);
        this.lerpTrack += lerpRate;
    }

    display() {
        push();
        translate(width/2, height/2);

        for (let i=0; i<mirrorNum; i++) {
            rotate(phyloAngle);
            ellipse(this.x, this.y, size);
        }

        pop();
    }

    run() {
        this.update();
        this.display();
    }
}

function setup() {
    shorter = min(windowWidth, windowHeight);
    createCanvas(windowWidth, windowHeight);

    // frameRate(1);
    angleMode(DEGREES)
    noStroke();
}

function draw() {
    background(127);

    if (petals.length < petalsNum && frameCount - currentTime > petalCD) {
        
        let r = c * sqrt(n)
        let a = n * phyloAngle;
        let x = r * cos(a)
        let y = r * sin(a)
        petals.push(new Petal(x, y));

        n -= mirrorNum;
        currentTime = frameCount;
    }

    for (let petal of petals) {
        petal.run();
    }
}

