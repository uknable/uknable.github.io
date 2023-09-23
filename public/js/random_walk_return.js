var NORTH = 0
var NORTHEAST = 1
var EAST = 2
var SOUTHEAST = 3
var SOUTH = 4
var SOUTHWEST = 5
var WEST = 6
var NORTHWEST = 7

var walkers = 20
var walkersArray = []

function setup() {
    createCanvas(windowWidth, windowHeight);

    background(0)

    for (var i=0; i<walkers; i++) {
        walkersArray[i] = new Walker()
    }
}

function draw() {
    fill(0, 2)
    noStroke()
    rect(0, 0, width, height)

    var mapMouse = int(map(mouseX, 0, width, 0, 20))

    for (var j=0; j<10; j++) {
        for (var i=0; i<walkersArray.length; i++) {
            walkersArray[i].walk()
            walkersArray[i].display()
        }
    }

    

}

class Walker {
    constructor() {
        this.posX = width/2
        this.posY = height/2
        this.direction = 0
        this.stepSize = 4
        this.diameter = 5
        this.alive = true
        this.beginX = 0
        this.beginY = 0
        this.distX = 0
        this.distY = 0
        this.pct = 0
        this.step = 0.001
        this.exponent = 4
        this.colour = color(int(random(255)), int(random(255)), int(random(255)))
    }

    walk() {
        if (this.alive) {   

            this.direction = int(random(0, 8))
            switch (this.direction) {
                case NORTH:
                    this.posY -= this.stepSize
                    break;
                case NORTHEAST:
                    this.posX += this.stepSize
                    this.posY -= this.stepSize
                    break;
                case EAST:
                    this.posX += this.stepSize
                    break;
                case SOUTHEAST:
                    this.posX += this.stepSize
                    this.posY += this.stepSize
                    break;
                case SOUTH:
                    this.posY += this.stepSize
                    break;
                case SOUTHWEST:
                    this.posX -= this.stepSize
                    this.posY += this.stepSize
                    break;
                case WEST:
                    this.posX -= this.stepSize
                    break;
                case NORTHWEST:
                    this.posX -= this.stepSize
                    this.posY -= this.stepSize
                    break;
                default:
                    break;
            }
    
            if (this.posX >= width || this.posY >= height || this.posX <= 0 || this.posY <= 0) { 
                this.beginX = this.posX
                this.beginY = this.posY
                this.diameter = 10
                this.alive = false
                console.log("i'm outside")
            }

        } else {

            this.distX = width/2 - this.beginX
            this.distY = height/2 - this.beginY

            this.pct += this.step
            if(this.pct < 1.0) {
                this.posX = this.beginX + this.pct * this.distX
                this.posY = this.beginY + pow(this.pct, this.exponent) * this.distY
            } else {
                this.diameter = 5
                this.pct = 0
                this.alive = true
            }

        }
    }

    display() {
        if (this.alive) {
            fill(255, 255, 255, 40)
            ellipse(this.posX + this.stepSize / 2, this.posY + this.stepSize / 2, this.diameter)
        } else {
            fill(255, 255, 255, 40)
            ellipse(this.posX + this.stepSize / 2, this.posY + this.stepSize / 2, this.diameter)
        }
    }
}