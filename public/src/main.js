let num = 4000;
let noiseScale = 400, noiseStrength = 1;
let particles = [num];
let x;
let y;

//p5 code
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  for (let i = 0; i < num; i++) {
    //x value start slightly outside the right of canvas, z value how close to viewer
    var loc = createVector(random(width * 1.2), random(height), 2);
    var angle = 30; //any value to initialize
    var dir = createVector(cos(angle), sin(angle));
    var speed = random(0, 2);
    //var speed = random(5, map(handY / 20, 0, width, 5, 20));   // faster
    particles[i] = new Particle(loc, dir, speed);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  fill(0, 10);
  noStroke();
  rect(0, 0, windowWidth, windowHeight);
  for (let i = 0; i < particles.length; i++) {
    particles[i].run();
  }
  lfo.frequency.value = handY / 150
}

class Particle {
  constructor(_loc, _dir, _speed) {
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
  }

  run() {
    this.move();
    this.checkEdges();
    this.update();
  }

  move() {
    let angle = noise(this.loc.x / noiseScale, this.loc.y / noiseScale, frameCount / noiseScale) * 50; //0-2PI
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    var vel = this.dir.copy();
    var d = 1;  //direction change
    vel.mult(this.speed * handY / 12); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel
  }

  checkEdges() {
    //float distance = dist(width/2, height/2, loc.x, loc.y);
    //if (distance>150) {
    if (this.loc.x < 0 || this.loc.x > width || this.loc.y < 0 || this.loc.y > height) {
      this.loc.x = random(width * handX / 20);
      this.loc.y = random(height * handY / 10);
    }
  }

  update() {
    fill(126, 130, 160);
    ellipse(this.loc.x, this.loc.y, this.loc.z);
  }
}

varhand = 0;
var handX = 0;
var handY = 0;
var handZ = 0;

var controller = Leap.loop({enableGestures: true}, function (frame) {
  hand = frame.hands.length;

  for (let i = 0; i < frame.hands.length; i++) {

    handX = frame.hands[0].palmPosition[0];
    handY = frame.hands[0].palmPosition[1];
    handZ = frame.hands[0].palmPosition[2];
  }
});


//sounds
const BaseAudioContext = window.AudioContext || window.webkitAudioContext
const context = new BaseAudioContext()

const osc = context.createOscillator()
osc.type = 'sine'
osc.frequency.value = 80;

const amp = context.createGain()
amp.gain.value = 0.01;
let lfo = context.createOscillator()
lfo.type = 'sine'

lfo.connect(amp.gain)
osc.connect(amp).connect(context.destination)
lfo.start()
osc.start()

const rangeO = document.createElement('input')
rangeO.type = 'range'
rangeO.min = 0
rangeO.max = 1000
rangeO.addEventListener('input', ev => {
  osc.frequency.value = ev.target.value
  console.log(ev.target.value)
})
rangeO.style.width = '100%'

const rangeL = document.createElement('input')
rangeL.type = 'range'
rangeL.min = 0
rangeL.max = 50
rangeL.addEventListener('input', ev => {
  lfo.frequency.value = ev.target.value
  console.log(ev.target.value)
})
rangeL.style.width = '100%'

window.onload = function () {
  const audio = new Audio('assets/testaudio.mp3');
  audio.volume = 0.5;
  audio.play();
}
