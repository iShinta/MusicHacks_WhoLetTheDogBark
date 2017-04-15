/*
 * getLevel() from the p5.Amplitude object
 * and map it to the ellipse position.
 */

var input;

var mic, soundFile;
var amplitude;
var mapMax = 1.0;

var threshold = 0.1;
var cutoff = 0;
var decayRate = 0.95;

function preload() {
  // load the sound, but don't play it yet
  soundFile = loadSound('../../music/Broke_For_Free_-_01_-_As_Colorful_As_Ever.mp3')
}

function setup() {
  c = createCanvas(windowWidth, windowHeight);
  background(255);
  // background(0);
  // fill(255);
  // noStroke();

  mic = new p5.AudioIn();
  mic.start();

  input = mic;

  // soundFile.play();

  // amplitude = new p5.Amplitude();
  // amplitude.setInput(soundFile);
  // amplitude.setInput(mic);
  // amplitude.smooth(0.8); // <-- try this!
}

function draw() {
  // Get the overall volume (between 0 and 1.0)
  var volume = input.getLevel();

  // If the volume > threshold + cutoff, a rect is drawn at a random location.
  // The louder the volume, the larger the rectangle.
  if (volume > threshold + cutoff) {
    stroke(0);
    fill(0, 100);
    //rect(random(40, width), random(height), volume*50, volume*50);
    drawPaw(random(40, width), random(height), volume*100, volume*100); //x, y, width, height

    // increase the cutoff
    cutoff = 0.5;
  }

  //
  cutoff = cutoff * decayRate;

  // Graph the overall potential volume, w/ a line at the threshold
  var y = map(volume, 0, 1, height, 0);
  var ythreshold = map(threshold + cutoff, 0, 1, height, 0);

  noStroke();
  fill(175);
  rect(0, 0, 20, height);

  // Then draw a rectangle on the graph, sized according to volume
  fill(0);
  rect(0, y, 20, y);
  stroke(0);
  line(0, ythreshold, 19, ythreshold);
}

function drawPaw(x, y, w, h){
  ellipseMode(CORNER);
  fill(255); //White
  ellipse(x+w*0.1, y, w*0.8, h*0.8);

  ellipseMode(CORNER);
  fill(100); //Gray
  ellipse(x, y, w/7*1.5, h/2);

  ellipseMode(CORNER);
  fill(100); //Gray
  ellipse(x+2*w/7, y-h/3, w/7*1.5, h/1.8);

  ellipseMode(CORNER);
  fill(100); //Gray
  ellipse(x+4*w/7, y-h/3, w/7*1.5, h/1.8);

  ellipseMode(CORNER);
  fill(100); //Gray
  ellipse(x+6*w/7, y, w/7*1.5, h/2);
}
