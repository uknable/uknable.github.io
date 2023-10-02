/*
Date: Saturday 16th September 2023
  
    Pretty satisfied after introducing a noise function to vary the row Y position
    Still could refactor Row display() method content into the Dash class

    Notes:
        It's very interesting to play with the noise input for the Row's display method

            frameCount determines how fast the wave progresses
                let n_rot = noise((this.index+frameCount*0.05)*0.05, (i+frameCount)*0.025);
                    vs
                let n_rot = noise((this.index+frameCount*1)*0.05, (i+frameCount)*0.025);

            (this.index+frameCount) determines the scope of noise field
                let n_rot = noise((this.index+frameCount*0.05)*0.05, (i+frameCount)*0.025);
                    vs
                let n_rot = noise((this.index+frameCount*0.05)*1, (i+frameCount)*0.025);


*/

let shorter, amp, rowH, ampNoiseIn, maxRowYVariance;

let rows = [];
let rowsNum = 40;
let rowCount = 0;

let colsNum = rowsNum;            // number of lines in a row

let freq = 5;               // number of waves
let phase = 0;              // y-position of waves
let phaseRate = 0.5;        // speed of waves
let phaseNoiseRate = 0.001;
let ampNoiseTrack = 0;      // wave amp variance
let ampNoiseRate = 0.05;


class Dash {
    constructor(index) {
        this.index = index;
        this.alpha = random(255);
        this.alphaDecay = 1;
    }

    // updateAlpha() {
    //     if (this.alpha > 0) this.alpha-=this.alphaDecay;
    // }
}

class Row {
    constructor(y, baseAmp, ampVariance, index) {
        this.y = y;
        this.baseAmp = baseAmp;
        this.ampVariance = ampVariance;
        this.index = index;

        this.rowYVariance;

        this.dashes = [];
        this.initDots();
    }

    initDots() {
        for (let i=0; i<colsNum; i++) {
            this.dashes.push(new Dash(i));
        }
    }

    checkDots() {
        for (let i=this.dashes.length; i>0; i--) {
            if (this.dashes[i].alpha <= 0) this.dashes.splice(i, 1);
        }
    }

    replaceRow() {
        if (this.y >= height) {
            rows.splice(this.index, 1, createRow());
        }
    }

    updateRowY() {
        this.y += phaseRate;
    }

    updateRowYVariance() {
        this.rowYVariance = noise((this.index*15+frameCount*1)*0.02) * maxRowYVariance;
    }

    updateRowX() {
        this.baseAmp -= phaseRate;
    }

    updateRowAmpVariance() {
        ampNoiseIn = (this.index + ampNoiseTrack) * ampNoiseRate;
        this.ampVariance = noise(ampNoiseIn) * amp;
    }

    update() {
        this.updateRowY();
        this.updateRowX();
        this.updateRowAmpVariance();
        this.updateRowYVariance();
    }

    display() {

        push();
        for (let i=0; i<this.dashes.length; i++) {
            // map number of dots across the width
            let x = map(this.dashes[i].index, 0, this.dashes.length, rowH/2, width+rowH/2);

            // if x position is less than the baseAmp+variance
            let strokeBase;
            let left;
            if (x < this.baseAmp+this.ampVariance) {
                strokeBase = 56;
                left = true;
            } else {
                strokeBase = 255;
                left = false;
            }

            let rotRange = -TAU/4;  // tends toward SW/NE

            let n_rot = noise((this.index*15+frameCount*1)*0.02, (i*5+frameCount*1)*0.01);
            // let rot = -TAU/4;
            let rot = n_rot * rotRange;
            let strokeVariance = n_rot * 150;

            if (left) {
                // strokeBase += strokeVariance;
                strokeBase = lerpColor(color(127), color(0), n_rot);
            } else {
                // strokeBase -= strokeVariance;
                strokeBase = lerpColor(color(255), color(127), n_rot);
            }

            push();
            translate(x, this.y+rowH/4 + this.rowYVariance);

            rotate(rot);
            stroke(strokeBase);
            strokeWeight(2);
            line(-rowH/2, 0, rowH/2, 0);
            pop();
        }
        pop();
    }

    run() {
        this.update();
        this.display();
    }
}

function createRow() {
    // calc initial y position
    let y = constrain(map(rowCount, 0, rowsNum, height, -rowH), -rowH*2, height);

    // calc wave shape
    let sinInput = map(rowCount, 0, rowsNum, 0, TWO_PI*freq);
    let rowSin = sin(sinInput) * amp;
    let rowDiagonal = constrain(map(rowCount, 0, rowsNum, 0, width), 0, width);

    // calc noise variance in wave shape
    let ampNoiseIn = (rowCount + ampNoiseTrack) * ampNoiseRate;
    let ampVariance = noise(ampNoiseIn) * amp;

    let rowObject = new Row(
        y, 
        rowSin + rowDiagonal,
        ampVariance,
        rowCount
    );

    rowCount++;

    return rowObject;
}

function setup() {
    shorter = min(windowWidth, windowHeight);
    // createCanvas(shorter, shorter);    
    createCanvas(windowWidth, windowHeight);    

    amp = width * 0.25;

    rowH = 20;
    rowsNum = floor(height/rowH);
    colsNum = floor(width/rowH);

    maxRowYVariance = height * 0.02;

    // init rows array with row objects
    for (let r=-1; r<rowsNum; r++) {
        rows.push(createRow());
    }
}

function draw() {
    background(127);

    // draw rows
    for (let r=0; r<rows.length; r++) {

        // check if row needs to be replaced
        if (rows[r].y >= height) {
            rows.splice(r, 1, createRow());
        }

        // run the row
        rows[r].run();
    }

    // -- or ++ changes direction of variance
    // ampNoiseTrack--;
    ampNoiseTrack++;

}

// testing purposes
function mousePressed() {
    if (isLooping()) {
        noLoop();
    } else {
        loop();
    }
}