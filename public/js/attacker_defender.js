/*
  This sketch was inspired by the Attacker/Defender game that Cindy Tonkin taught us during the first week of improv
  Upon creation, the Player object is assigned one attacker and one defender
  The Player has to position themself such that their Defender is in between themselves and the Attacker
  Emergent behaviours arise from this simple rule
  To provide some structure/reliability to the sketch, every Player occupies a certain distance from the center of the sketch
  The players only know two things: their attacker and their defender, but when many players are trying to position themselves behind their defender, suprising behaviours emerge
*/

const margin = 200;
// needs to be at least 5 to look like something resembling the game
// 9 is a good number
let playersNum = 11; 
let players = [];

function setup() {
  createCanvas(windowWidth, windowHeight);


  for (let i=0; i<playersNum; i++) {
    players.push(new Player(i));
  }

  for (let player of players) {
    player.assign();
  }

  cursor(HAND);
}


function draw() {
  background(0, 30);
  translate(width/2, height/2);

  drawPlayers();
} 

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// answered Oct 3, 2017 at 13:16 by superluminary
function shufflePlayers() {
  let shuffled = players
  .map(value => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);

  players = shuffled;
}

function mousePressed() {
  shufflePlayers();
}


function drawPlayers() {
  for (let player of players) {
    player.run();
  }
}

class Player {
  constructor(i) {
    this.pos = createVector(random(-width/2, width/2), random(-height/2, height/2));
    this.i = i;
    this.a, this.d;
    this.lerpRate = random(0.01, 0.1);
    this.multScalar = random(width/2);
  }

  assign() {
    this.a = (this.i+1)%players.length;
    this.d = (this.i+2)%players.length;
  }

  update() {
    let a = players[this.a].pos.copy();
    let d = players[this.d].pos.copy();
    let target = p5.Vector.sub(d, a);
    target.normalize().mult(this.multScalar);
    this.pos = p5.Vector.lerp(this.pos, target, this.lerpRate);
  }

  draw() {
    noStroke();
    fill('white');
    ellipse(this.pos.x, this.pos.y, 20);
  }

  run() {
    this.update();
    this.draw();
  }
} 