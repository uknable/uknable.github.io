/*  
    Date: Sunday 15th October 2023

    I want to create a grid of waves that periodically send ripples but when the mouse hovers over it the ripples die down
    I'm trying to express how my emotions hide from my conscious effort to observe them

    Todo:
        [ ] Abstract into classes
        [ ] Fix cellH and cellW to some predetermined size instead of scaling to rowsNum/colsNum
            - Will make the sketch look more consistent
        [ ] Colour

    Note:
        Bezier calculations seem to need a lot of power
        Using sin/cos are the key to making things look 3D

    Overview:
        Sketch draws a line on every row made up of cells that draw a sine wave
        Cells are made up of bezierVertex's
        Every other cell alternates drawing one half of a sine wave
        The y-coordinates of every cell is altered with the noise function
        Cells within a certain radius of the mouse are flattened by multiplying the noise variation by some number that is less than 1
*/

let cellH, cellW;
const rowsNum = 30;
const colsNum = 50;


function setup() {
    createCanvas(windowWidth, windowHeight);

    cellH = height/rowsNum;
    cellW = width/colsNum;
}

function draw() {
    background(127);

    push();
    for (let i=0; i<rowsNum; i++) {
        
        beginShape();
        vertex(0, cellH*i);
        
        for (let j=0; j<colsNum+1; j++) {
            
            const xBase = cellW*j;
            
            const yBase = map(i, 0, rowsNum-1, cellH/2, height-cellH/2);
            const yPhase = noise(i+frameCount*0.005, j+frameCount*0.005) * cellH;

            let mouseScalar = 1;
            const mouseDist = dist(mouseX, mouseY, xBase, yBase);
            const mouseRadius = height/4;
            if (mouseDist < mouseRadius) {
                mouseScalar = map(mouseDist, mouseRadius, 0, 1, -0.5) < 0 ? 0 : map(mouseDist, mouseRadius, 0, 1, -0.5);
            }

            if (j%2==0) {
                // Downward half of the wave
                bezierVertex(
                    xBase-cellW/2,   yBase+yPhase*mouseScalar, 
                    xBase-cellW/2,   yBase-yPhase*mouseScalar, 
                    xBase,           yBase-yPhase*mouseScalar
                );
            } else {
                // Upward half of the wave
                bezierVertex(
                    xBase-cellW/2,   yBase-yPhase*mouseScalar, 
                    xBase-cellW/2,   yBase+yPhase*mouseScalar, 
                    xBase,           yBase+yPhase*mouseScalar
                );
            }
        }
        
        noFill();
        stroke('black');
        strokeWeight(2);
        endShape();
    }
    pop();
}