let maxFishLength
let numFish = 15
let fishArray = new Array()
let waveSpeed

function setup() {
    createCanvas(windowWidth-20, windowHeight-20)
    strokeWeight(1)
    // randomSeed(2)
    noFill()
    maxFishLength = width/4

    // if distracted
    // noLoop()
    
    for (let i=0; i<numFish; i++) {
        let sineFishHeight = random(maxFishLength)
        fishArray.push(new sineFish(random(width), sineFishHeight, sineFishHeight, sineFishHeight, PI/4))
    }
}

function windowResized() {
    resizeCanvas(windowWidth-20, windowHeight-20)
}

function draw() {
    background(255)

    waveSpeed = frameCount*-0.05
    
    for (let i=0; i<fishArray.length; i++) {
        fishArray[i].display()
    }
    
    waves()
}

function waves() {
    line(0, height/2, width, height/2)
}

class sineFish {
    constructor(xPos, yPos, length, trajectoryHeight, rotation) {
        this.xPos = xPos
        this.yPos = yPos
        this.bodyLength = length
        this.maxHeight = length/6
        this.rotation = rotation
        this.trajectoryHeight = trajectoryHeight

        // radianIncrement determines frequency of the waves
        // PI/4 or smaller makes for smooth waves
        this.radianIncrement = PI/3

        // number of points determine fidelity of the fish
        this.points = 70

        //tailPoint determines where the body ends and tail starts
        this.tailPoint = int(this.points*0.75)
    }

    display() {
        push()

        // let xTranslate = cos(this.yPos + waveSpeed*0.1) * this.trajectoryHeight
        let tempo = this.yPos + waveSpeed*0.1
        let yTranslate = sin(tempo) * this.trajectoryHeight
        // let rotation = map(sin(tempo), -1, 1, -PI/4, PI/4)
        let rotation = cos(tempo) * PI/4

        translate(this.xPos, yTranslate + height/2)
        rotate(rotation)


        beginShape()
        for (let i=0; i<this.points; i++) {
            // map to -this.bodyLength/2 to this.bodyLength/2 so rotate() works from the middle
            let xPos = map(i, 0, this.points, -this.bodyLength/2, this.bodyLength/2)

            // bodyHeightOsc uses tailPoint to determine the value for sin() to create the fish shape 
            let bodyHeightOsc = map(i, 0, this.tailPoint, 0, PI)
            
            let bodyHeight = sin(bodyHeightOsc) * this.maxHeight

            // wiggling
            let maxWaveLength = 100
            let waveLength = map(i, 0, this.bodyLength, 0, maxWaveLength)
            // the middle fish look really good with these settings
            let wiggleIntensity = map(this.bodyLength, 0, maxFishLength, 1, PI)
            let xOffset = sin(waveLength + waveSpeed) * wiggleIntensity

            curveVertex(
                xPos + xOffset,
                sin(i * this.radianIncrement + waveSpeed) * bodyHeight
            )
        }
        endShape()

        pop()

        this.update()
    }

    update() {
        // fish move speed scales with this.bodyLength
        let mappedXIncrement = map(this.bodyLength, 0, maxFishLength, 0, 1)
        this.xPos -= mappedXIncrement
        // if fish hits the left side of the window,
        // have them reappear on the right side
        if (this.xPos <= -this.bodyLength/2) this.xPos = width + this.bodyLength/2
    }
}

