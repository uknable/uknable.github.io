const points = 8;
const flowers = [];

let shorter;

function setup() {
    createCanvas(windowWidth, windowHeight);
    shorter = min(width, height);

    flowers.push(new Flower(points, 0.01));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    shorter = min(width, height);
}

function draw() {
    background(255, 15);
    
    for (let i=0; i<flowers.length; i++) {
        flowers[i].run();

        if (flowers[i].radius > shorter/5 && !flowers[i].gaveBirth) {
            flowers.push(new Flower(points, 0.01))
            flowers[i].gaveBirth = true;
        }
    }
}

class Flower {
    constructor(points, speed) {
        this.points = points;
        this.speed = speed;
        this.radius = 0;
        this.angleSlice = TWO_PI/points;
        this.expo = 0.5;
        this.array = [];
        this.gaveBirth = false;
    }

    setup() {
        for (let i=0; i<this.points; i++) {

            const x = cos(this.angleSlice*i+frameCount*0.001)*this.radius;
            const y = sin(this.angleSlice*i+frameCount*0.001)*this.radius;
       
            const coord = createVector(x, y);
            this.array[i] = coord;
        }
    }

    draw() {
        push();
        translate(width/2, height/2);

        for (let i=0; i<this.array.length; i+=2) {
            line(this.array[i].x, this.array[i].y,
                this.array[i+1].x, this.array[i+1].y)
        }

        pop();

        this.update();
    }

    update() {
        this.radius+=this.expo;
    }

    run() {
        this.setup();
        this.draw();
        this.update();
    }
}
