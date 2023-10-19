/*
    Date: Sunday 15th October 2023

    I want to create a grid of waves that periodically send ripples but when the mouse hovers over it the ripples die down
    I'm trying to express how my emotions hide from my conscious effort to observe them

    Todo:
        [ ] Abstract into classes
        [X] Fix cellH and cellW to improve consistency between screen sizes
        [ ] Play with !!
            Multiplying yCount by frameCount results in changing tesselations where waves still don't overlap
            Can use this to create perspective
                Make top waves smaller, bot waves larger?

    Note:
        Bezier calculations seem to need a lot of power
        Using sin/cos are the key to making things look 3D
*/

const cellH = 30;   // 62,  30
const cellW = 3;    // 7,   3

function setup() {
    createCanvas(windowWidth, windowHeight);
        
    noFill();
    stroke('black');
    strokeWeight(1.4);

    pixelDensity(1); // for mobile, pixelDensity(2) is default
}

function draw() {
    background(126);

    push();

    let yCount = 0;
    for (let y=0; y<height; y+=cellH) {
        yCount++;
        
        const yPhaseNoiseIn = frameCount*0.014 + yCount*14;
        const yPhase = noise( yPhaseNoiseIn ) * cellH;

        beginShape();
        vertex( -cellW, y+yPhase );

        let xCount = 0;
        for (let x=0; x<width; x+=cellW) {
            xCount++;

            const yPhaseVar = sin( frameCount*0.028 + xCount*0.056 + yCount*279.9 ) * cellH/4; // !!

            if ( xCount%2 == 0 ) {
                // Downward half of the wave
                bezierVertex(
                    x-cellW/2,        y-yPhase+yPhaseVar, 
                    x-cellW/2,        y+yPhase-yPhaseVar, 
                    x,                y+yPhase-yPhaseVar
                );
            } else {
                // Upward half of the wave
                bezierVertex(
                    x-cellW/2,        y+yPhase-yPhaseVar, 
                    x-cellW/2,        y-yPhase+yPhaseVar, 
                    x,                y-yPhase+yPhaseVar
                );
            }
        }
        endShape();
    }
    pop();
}