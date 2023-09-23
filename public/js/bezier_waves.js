let pts = new Array([0]);
let int = 4;
let cols = 10*int;
let rows = 250;
let xoff = 0;
let yoff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  noFill();
  strokeWeight(1);

  // populate();
  // // drawpts();
  // drawbez();
}

function draw() {
  background(255);
  pts = [];
  populate();
  drawbez();
  xoff+=.3;
  yoff+=.1;
}

function populate() {
  for (let i=0; i<cols+2; i++) {
    let sy = height/rows;
    let h = -sy;
    const sx = width/cols;
    const w = i*(sx+sx);
    pts.push([w]);

    for (let j=0; j<rows; j++) {
      h += noise((i+xoff)*.1, (j+yoff)*.1)*sy*2.5;
      pts[i].push(h);
    }
  }
}

function drawpts() {
  for (let j=1; j<rows; j++) { 
  // j=1 to avoid first janky row
    beginShape();
    for (let i=0; i<cols+2; i++) {
    // i<cols+2 to fill width of the screen
      stroke(255/rows*i, 255/rows*j, 255);
      vertex(pts[i][0], pts[i][j]);
    }
    endShape();
  }
}
  // figuring this out first helps me get to drawbez()

function drawbez() {
  for (let j=1; j<rows; j++) {
    beginShape();
    for (let i=0; i<cols; i+=4) {
      stroke(255/rows*i, 255/rows*j, 255);
      if (i==0) vertex(pts[i][0], pts[i][j]);
      bezierVertex(
        pts[i+1][0], pts[i+1][j], 
        pts[i+2][0], pts[i+2][j], 
        pts[i+3][0], pts[i+3][j]
      );
    }
    endShape();
  }
}