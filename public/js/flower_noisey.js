let petalPts = 14
let diameterInc = 100
let strWeight = 2
let circles = new Array()
let noises = new Array()
let maxRadius, circlesNum
let angleInc = 0

// petalAnchor cannot be larger than petalDepth
let petalDepth = 2
let petalAnchor = 1


function setup() {
    createCanvas(windowWidth-20, windowHeight-20)

    smooth()

    maxRadius = Math.max(width, height)/2
    circlesNum = maxRadius/diameterInc

    for (let i=0; i<circlesNum; i++) {
        noises[i] = random(100)
    }

}

function draw() {

    for (let i=0; i<circlesNum; i++) {
        
        // debug
        // strokeWeight(1)
        // noFill()
        // ellipse(0, 0, diameterInc * i)

        circles[i] = new Array()

        for (let j=0; j<petalPts+1; j++) {
            // let angleNoise = map(noise(noises[i]), 0, 1, 0, 1)
            let angleNoise = 0
            let pointsNoise = map(noise(noises[i]), 0, 1, 0, 100)
            
            let angle = radians(360/petalPts * j) 
    
            // Have to divide by 2 to get radius
            let x = (diameterInc*i/2 + pointsNoise) * cos(angle + angleNoise)
            let y = (diameterInc*i/2 + pointsNoise) * sin(angle + angleNoise)

            
            circles[i].push(createVector(x, y))
            noises[i] += 0.0005
        }
    }

    translate(width/2, height/2)
    
    background(255)

    // alternates when drawing other side of the petal
    let left = true
    strokeWeight(strWeight)
    for (let i=0; i<petalPts; i++) {
        for (let j=petalDepth; j<circles.length-petalDepth; j++) {
            if (left) {
                // first coord is higher than second coord by petalDepth    
                bezier(
                    circles[j+petalDepth][i].x, circles[j+petalDepth][i].y,
                    circles[j+petalDepth-petalAnchor][i].x, circles[j+petalDepth-petalAnchor][i].y, 
                    circles[j+petalAnchor][i+1].x, circles[j+petalAnchor][i+1].y,
                    circles[j][i+1].x, circles[j][i+1].y
                )
            } else {
                // first coord is lower than second coord by petalDepth 
                bezier(
                    circles[j][i].x, circles[j][i].y, 
                    circles[j+petalAnchor][i].x, circles[j+petalAnchor][i].y, 
                    circles[j+petalDepth-petalAnchor][i+1].x, circles[j+petalDepth-petalAnchor][i+1].y,
                    circles[j+petalDepth][i+1].x, circles[j+petalDepth][i+1].y)
            }
        }
        left = !left
    }
}