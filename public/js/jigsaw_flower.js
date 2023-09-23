const columns = 3;
const rows = 3;

let points = [];
let reference = [];
let pieceWidth, pieceHeight;
let jigsaw;
let placeholderPiece;
let nowHolding = false;
let gameEnd = false;
let triggerEndAnim = false;
let clickedPiece, currentPiece;
//flower
let petals = 14; // number of petals
let angleSlice; // will determine the angle with which a petal will be drawn
let rotationSpeed = 0.005;

let shortside; // used to regulate size

//petal shape
let feet, shoulders, head;

//arrays for petal verticies
let pointsFeet = [];
let pointsShoulders = [];
let pointsHead = [];

function setup() {
    createCanvas(windowWidth, windowHeight);

    jigsaw = createGraphics(windowWidth, windowHeight);//this allows the canvas to be split into pieces
    jigsaw.noStroke();

    pieceWidth = width / columns; // pieceWidth and pieceHeight will be used to create the coords where the jigsaw pieces will be drawn from
    pieceHeight = height / rows;

    populatePoints(); //gives the points array the coords where jigsaw pieces will be drawn

    placeholderPiece = createGraphics(pieceWidth, pieceHeight); //this graphic will replace the puzzle that was picked
    drawPlaceholder();

    angleSlice = radians(360 / petals);

    // flower size
    shortside = max(width, height);
    feet = shortside/2;
    shoulders = shortside*2;
    head = shortside*3;

}


function draw() {
    jigsaw.background(255);

    generateFlower();

    drawJigs(); //draws the jigsaw pieces on the canvas

    if (nowHolding) { //sets piece to cursor if a piece is currently picked up
        pickupPiece(clickedPiece);
    }

    // console.log(triggerEndAnim);
    if (triggerEndAnim) {
        endAnim();
    }

    if (gameEnd) {
        noCursor();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
    // flower size
    shortside = max(width, height);
    feet = shortside/2;
    shoulders = shortside*2;
    head = shortside*3;

    if (!gameEnd) {
        pieceWidth = width / columns; // pieceWidth and pieceHeight will be used to create the coords where the jigsaw pieces will be drawn from
        pieceHeight = height / rows;
        populatePoints(); //gives the points array the coords where jigsaw pieces will be drawn
    
        placeholderPiece = createGraphics(pieceWidth, pieceHeight); //this graphic will replace the puzzle that was picked
        drawPlaceholder();

    }

}

/*          FLOWER             */

function generateFlower() {
    flowerPoints(); //populates arrays which flowerPetals() will use to draw the individual petals
    flowerPetals(); //draws the individual petals
}


function flowerPoints() {
    pointsFeet = [];
    pointsShoulders = [];
    pointsHead = [];

    for (let i = 0; i < petals; i++) {
        let angle = angleSlice * i + rotationSpeed + (frameCount * rotationSpeed);
        //petal feet
        let x1 = map(cos(angle), -1, 1, -feet, feet) + width;
        let y1 = map(sin(angle), -1, 1, -feet, feet) + height;
        //petal shoulders
        let x2 = map(cos(angle), -1, 1, -shoulders, shoulders) + width;
        let y2 = map(sin(angle), -1, 1, -shoulders, shoulders) + height;
        //petal head
        let angleTip = angle + (angleSlice / 2);
        let x3 = map(cos(angleTip), -1, 1, -head, head) + width;
        let y3 = map(sin(angleTip), -1, 1, -head, head) + height;

        pointsFeet.push([x1, y1]);
        pointsShoulders.push([x2, y2]);
        pointsHead.push([x3, y3]);
    }
}


//for noise
let xoff = 0;
let yoff = 0;
let noiseVar;

let counter = 0; //used for lerping colour and position of petals for ending animation
// const animationTime = 4000; // how many frames it takes for flower to reach rest position for ending animation
const animationTime = 4000; // debugging
let noiseArray = [];
let colourArray = [];
const minFlowerPos = -0.05;
const maxFlowerPos = 0.5;

function flowerPetals() {
    for (let i = 0; i < pointsFeet.length; i++) {
        yoff = noise(xoff, i);
        const noiseyColour = color(255 * yoff);

        // if puzzle is not completed
        if (!gameEnd) {
            counter = 0; //so you can watch the ending animation again if you mess up the puzzle after completion
            jigsaw.fill(noiseyColour); //gives each petal their own colour
            noiseVar = map(yoff, 0, 1, minFlowerPos, maxFlowerPos); //varies the position of the petals
            noiseArray[i] = noiseVar;
        } else { // else if puzzle is completed
            if(counter <= animationTime) {
                counter++;
            }
            //lerps colour
            let currentLerp = map(counter, 0, animationTime, 0, 1);
            let colourTo = color(255 - 20 * i, 255 - 10 * i, 255 - 5 * i); //ending animation colour
            colourArray[i] = lerpColor(noiseyColour, colourTo, currentLerp);
            jigsaw.fill(colourArray[i]);
            //lerps petal position, 0.5 is the middle of the screen
            let noiseVarTo = 0.5;
            //I had to introduce the following if-statement to keep the flower in the final position
            //it has to do with counter always incrementing(line 107). Alternatively, I could clamp counter to a specific range
            noiseVar = lerp(noiseArray[i], noiseVarTo, currentLerp);

            if (noiseVar == noiseVarTo) {
                triggerEndAnim = true;
            }
        }
        //this switch statement stitches the end of the array to the start of the array which is necessary because each drawing
        //of a petal relies on a pair of adjacent points
        switch (i) {
            case (pointsFeet.length - 1):
                drawPetal(
                    pointsFeet[i][0] * noiseVar,        pointsFeet[i][1] * noiseVar,
                    pointsShoulders[i][0] * noiseVar,   pointsShoulders[i][1] * noiseVar,
                    pointsHead[i][0] * noiseVar,        pointsHead[i][1] * noiseVar,
                    pointsShoulders[0][0] * noiseVar,   pointsShoulders[0][1] * noiseVar,
                    pointsFeet[0][0] * noiseVar,        pointsFeet[0][1] * noiseVar
                );
                break;
            default:
                drawPetal(
                    pointsFeet[i][0] * noiseVar,        pointsFeet[i][1] * noiseVar,
                    pointsShoulders[i][0] * noiseVar,   pointsShoulders[i][1] * noiseVar,
                    pointsHead[i][0] * noiseVar,        pointsHead[i][1] * noiseVar,
                    pointsShoulders[i+1][0] * noiseVar, pointsShoulders[i+1][1] * noiseVar,
                    pointsFeet[i+1][0] * noiseVar,      pointsFeet[i+1][1] * noiseVar
                );
                break;
        }
    }
    
    xoff += 0.003;
}

function drawPetal(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5) {
    jigsaw.beginShape();
    jigsaw.vertex(x1, y1);
    jigsaw.vertex(x2, y2);
    jigsaw.vertex(x3, y3);
    jigsaw.vertex(x4, y4);
    jigsaw.vertex(x5, y5);
    jigsaw.endShape();
}


/*          GAME           */

function populatePoints() { //creates the coords for the jigsaw
    let counter = 0;
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            let point = [i * pieceWidth, j * pieceHeight];
            // points.push(point);
            points[counter] = point;
            counter++;
        }
    }
    reference = points; //reference array stores correct order of coords
    points = shuffle(points); //shuffle the jigsaw pieces
}

function drawPlaceholder() { //this is to replace the piece that was picked up
    placeholderPiece.background(100);
}

function drawJigs() { //uses the correct coords and pastes the pieces reflected from the shuffled coords
    for (let i = 0; i < reference.length; i++) {
        image(jigsaw, reference[i][0], reference[i][1], pieceWidth, pieceHeight,
            points[i][0], points[i][1], pieceWidth, pieceHeight);
    }
}

function mouseClicked() { //if mouse is clicked, pick up piece if not holding or drop if holding
    if(!gameEnd) {
        clickedPiece = areaCheck();
    
        if (nowHolding) {
            swapPiece(clickedPiece);
            cursor(HAND);
            nowHolding = false;
        } else {
            pickupPiece(clickedPiece);
            currentPiece = clickedPiece;
            cursor(MOVE);
            nowHolding = true;
        }

    }
}

function areaCheck() { //checks and returns what area on the canvas you clicked on
    let whichPiece;

    for (let i = 0; i < reference.length; i++) { //the canvas area of each piece
        if (mouseX > reference[i][0] && mouseX < reference[i][0] + pieceWidth &&
            mouseY > reference[i][1] && mouseY < reference[i][1] + pieceHeight) {
            whichPiece = i;
        }
    }
    return whichPiece;
}

function pickupPiece(piece) {  //puts the grey placeholder graphic on the area you clicked on and puts the piece on your cursor
    image(placeholderPiece, reference[piece][0], reference[piece][1], pieceWidth, pieceHeight,
        0, 0, pieceWidth, pieceHeight);
    image(jigsaw, mouseX - pieceWidth / 2, mouseY - pieceHeight / 2, pieceWidth, pieceHeight,
        points[piece][0], points[piece][1], pieceWidth, pieceHeight);
}

function swapPiece(piece) { //swaps the piece you're holding with the piece you clicked on, checks if you finished
    let swapZone;
    swapZone = points[piece];
    points[piece] = points[currentPiece];
    points[currentPiece] = swapZone;
    checkWinCondition(); //check if player finished puzzle;
}

function checkWinCondition() {
    for (let i = 0; i < points.length; i++) {
        if (points[i] != reference[i]) { //checks every coordinate of the shuffled array against reference array, https://stackoverflow.com/questions/4025893/how-to-check-identical-array-in-most-efficient-way
            gameEnd = false;
            return; //gets out of the function if a piece is not in the right spot
        }
    }
    gameEnd = true; //used in the generateFlower() function
}

let polygonArray = [];
const spawnPolygonCD = 240;
let currentPolygonCD = 0;
let polygonCount = 2;

function endAnim() {
    const zoomRate = 1;

    if (frameCount - currentPolygonCD >=  spawnPolygonCD) {
        if(counter%2 == 0) {
            polygonArray.push(new Polygon(polygonCount%(colourArray.length-1)));
        } else {
            polygonArray.push(new Flower(polygonCount%(colourArray.length-1)));
        }

        if(polygonArray.length > 10) {
            polygonArray.splice(0, 1);
        }

        currentPolygonCD = frameCount;
        polygonCount+=3;
    }
    
    for (let i=0; i<polygonArray.length; i++) {
        polygonArray[i].run();
    }

    feet += zoomRate;
}

class Polygon {
    constructor(count) {
        this.array = [];
        this.radius = 0;
        this.colour = colourArray[count];
    }


    populate() {
        for (let i=0; i<petals; i++) {
            let angle = angleSlice * i + rotationSpeed + (frameCount * rotationSpeed);
            const x = cos(angle) * this.radius;
            const y = sin(angle) * this.radius;
            this.array[i] = createVector(x, y);
        }
    }


    draw() {
        noStroke();
        fill(this.colour);
        beginShape();
        for (let i=0; i<this.array.length; i++) {
            vertex(width/2 + this.array[i].x, height/2 + this.array[i].y);
        }
        vertex(width/2 + this.array[0].x, height/2 + this.array[0].y);  
        endShape();
    }


    update() {
        this.radius++;
    }

    run() {
        this.populate();
        this.draw();
        this.update();
    }

}

class Flower {
    constructor(count) {
        this.array = [];
        this.radius = 0;
        this.colour = colourArray[count];
    }

    populate() {
        for (let i=0; i<petals; i++) {
            let angle = angleSlice * i + rotationSpeed + (frameCount * rotationSpeed);
            const x = cos(angle) * this.radius;
            const y = sin(angle) * this.radius;
            this.array[i] = createVector(x, y);
        }

    }

    draw() {
        noStroke();
        fill(this.colour);
        beginShape();
        for (let i=0; i<this.array.length; i++) {
            vertex(width/2 + this.array[i].x, height/2 + this.array[i].y);
        }
        vertex(width/2 + this.array[0].x, height/2 + this.array[0].y);  
        endShape();
    }

    update() {
        this.radius++;

    }

    run() {
        this.populate();
        this.draw();
        this.update();

    }
}