/*
  NEW
  */

/*
 * getLevel() from the p5.Amplitude object
 * and map it to the ellipse position.
 */

var input;
var openMouthTrue;
var img;
var soundFile;

var mapMax = 1.0;

var backgroundColor;
var paw;

var threshold = 0.1;
var cutoff = 0;
var decayRate = 0.95;


// :: Beat Detect Variables
// how many draw loop frames before the beatCutoff starts to decay
// so that another beat can be triggered.
// frameRate() is usually around 60 frames per second,
// so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// we wont respond to every beat.
var beatHoldFrames = 15;

// what amplitude level can trigger a beat?
var beatThreshold = 0.11;

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
var beatCutoff = 0;
var beatDecayRate = 0.98; // how fast does beat cutoff decay?
var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.

var paws = new Array(50);
var pawsx = new Array(50);
var pawsy = new Array(50);

function preload() {
  // load the sound, but don't play it yet
  soundFile = loadSound('06 Shake It Off.m4a');
  imgDogClosedMouth = loadImage("rsz_dogepls1_clipped_rev_1.png");
  imgDogOpenMouth = loadImage("rsz_finalopenmouth_clipped_rev_1.png");
  paw = loadImage("paw.png");

}

function setup() {
  openMouthTrue = false;
  c = createCanvas(windowWidth, windowHeight);



  backgroundColor = color( random(0,255), random(0,255), random(0,255) );



  input = soundFile;

  soundFile.play();

  amplitudeDog = new p5.Amplitude();
  amplitudeDog.setInput(soundFile);
  amplitudeDog.smooth(0.9); // <-- try this!
}

function draw() {

  background(backgroundColor);
  push();
  if (openMouthTrue == true) {
    image(imgDogOpenMouth, 0, 0);
  } else if (openMouthTrue == false) {
    image(imgDogClosedMouth, 0, 0);
  }
  pop();
  // Get the overall volume (between 0 and 1.0)
  var volume = amplitudeDog.getLevel();


  // If the volume > threshold + cutoff, a rect is drawn at a random location.
  // The louder the volume, the larger the rectangle.
  if (volume > threshold + cutoff) {


    paws.push(volume);
    paws.splice(0, 1);

    pawsx.push(random(40, width));
    pawsx.splice(0, 1);

    pawsy.push(random(height));
    pawsy.splice(0, 1);

    cutoff = 0.5;
  }

  for(var i = 0; i < paws.length; i++){
    stroke(0);
    fill(0, 100);
    image(paw, pawsx[i], pawsy[i], paw.width*paws[i]/2, paw.height*paws[i]/2);
  }

  //
  cutoff = cutoff * decayRate;
  var levelDog = amplitudeDog.getLevel();
  detectBeat(levelDog);


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


function detectBeat(level) {
  if (level  > beatCutoff && level > beatThreshold){
    onBeat();
    beatCutoff = level * 1.2; //1.2;
    framesSinceLastBeat = 0;

  } else{
    if (framesSinceLastBeat <= beatHoldFrames){
      framesSinceLastBeat ++;
    }
    else{
      beatCutoff *= beatDecayRate;
      beatCutoff = Math.max(beatCutoff, beatThreshold);
    }
  }
}

function onBeat() {
  var woof = new Audio('woof.mp3');
  woof.play();
  backgroundColor = color( random(0,255), random(0,255), random(0,255) );
  openMouthTrue = !openMouthTrue;
}
