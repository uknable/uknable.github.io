const points = 10;
const flowers = [];

let shorter;

function setup() {
    createCanvas(windowWidth, windowHeight);
    shorter = min(width, height);

    noFill();

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

        if (flowers[i].radius > shorter/10 && !flowers[i].gaveBirth) {
            flowers.push(new Flower(points, 0.01)); 
            flowers[i].gaveBirth = true;
        }
    }
}

class Flower {
    constructor(points, speed) { 
        this.points = points;
        this.speed = speed; // varying speed makes it go crazy
        this.radius = 0;
        this.angleSlice = TWO_PI/points;
        this.expo = 0.5;
        this.array = [];
        this.gaveBirth = false;
        this.colour = color(int(random(255)), int(random(255)), int(random(255)));
    }

    setup() {
        for (let i=0; i<this.points; i++) {

            const x = cos(this.angleSlice*i+frameCount*this.speed)*this.radius;
            const y = sin(this.angleSlice*i+frameCount*this.speed)*this.radius;
       
            const coord = createVector(x, y);
            this.array[i] = coord;
        }
    }

    draw() {
        stroke(this.colour);
        push();
        translate(width/2, height/2);

        for (let i=0; i<this.array.length; i++) { 
            
            const x = cos(this.angleSlice*i+this.angleSlice/2+frameCount*0.001)*this.radius*1.3;
            const y = sin(this.angleSlice*i+this.angleSlice/2+frameCount*0.001)*this.radius*1.3;

            if(i == this.array.length-1) {

                bezier(
                    this.array[i].x, this.array[i].y,
                    x, y,
                    x, y,
                    this.array[0].x, this.array[0].y
                )
            } else {

                bezier(
                    this.array[i].x, this.array[i].y,
                    x, y,
                    x, y,
                    this.array[i+1].x, this.array[i+1].y
                )

            }
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
