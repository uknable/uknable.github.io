let waves = 20
let waveDetail = 25
let noiseOffset = 0
let noiseOffsetInc = 0.001
let maxHSBValue = 360

function setup() {
  createCanvas(windowWidth, windowHeight)
  background(0)
  // noLoop()
  noStroke()
  colorMode(HSB, maxHSBValue)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

function draw() {
  background(8, 80, 360)

  for (let i=0; i<waves; i++) {
    let waveHeight = height/waves

    // multiply waveHeight by i to create evenly spaced layers of waves
    // we will feed waveMaxHeight into a map() with noise to determine
    // the shape of the wave
    let waveMaxHeight = waveHeight * i

    // adding noiseOffset to counter makes each wave look different
    let counter = noiseOffset + i + frameCount * 0.005

    // increment our counter value by this much
    let counterInc = 0.1



    fill(
      8,
      maxHSBValue/waves * i + 100,
      maxHSBValue 
    )


    beginShape()
    vertex(0, height);

    // initialise for-loop condition as j<=waveDetail to extend the wave 
    // to the right edge of the screen
    for (let j=0; j<=waveDetail; j++) {
      let waveSegmentWidth = width/waveDetail

      let waveHeightNoise = noise(counter)

      // Determines the height of the wave segment with noise() and waveMaxHeight.
      // The max value of our new range is waveMaxHeight + waveHeight
      // so that it ensures an even arrangement of wave layers
      let waveSegmentHeight = map(waveHeightNoise, 0, 1, waveMaxHeight, waveMaxHeight + waveHeight*2)

      vertex(waveSegmentWidth * j, waveSegmentHeight)
      
      counter += counterInc
    }
    vertex(width, height)
    endShape()
  }

  noiseOffset += noiseOffsetInc

}