let mic;
let capture;
let micLevel = 0;
let lastKey = '';
let audioContext;
let oscillator;
let isPlayingSound = false;

function setup() {
  createCanvas(400, 400);
  textAlign(LEFT, TOP);

  // Try to get microphone
  mic = new p5.AudioIn();

  // Try to get webcam
  capture = createCapture(VIDEO);
  capture.size(160, 120);
  capture.hide();
}

function draw() {
  background(240);

  // Title
  fill(0);
  textSize(18);
  text('Peripheral Permissions Test', 10, 10);

  let yPos = 50;
  textSize(14);

  // Microphone status
  fill(0);
  text('🎤 Microphone:', 10, yPos);
  if (mic && mic.enabled) {
    try {
      micLevel = mic.getLevel();
      fill(0, 150, 0);
      text('✓ Active', 140, yPos);
      // Visual feedback - level meter
      fill(0, 200, 0);
      rect(10, yPos + 20, micLevel * 300, 10);
    } catch (e) {
      // Mic is starting but not ready yet
      fill(150, 100, 0);
      text('⚠ Starting...', 140, yPos);
    }
  } else {
    fill(150, 0, 0);
    text('✗ Not enabled', 140, yPos);
    fill(100);
    text('Click to start', 10, yPos + 20);
  }

  yPos += 60;

  // Keyboard status
  fill(0);
  text('⌨️  Keyboard:', 10, yPos);
  if (lastKey !== '') {
    fill(0, 150, 0);
    text('✓ Active', 140, yPos);
    fill(0, 200, 0);
    text('Last key: "' + lastKey + '"', 10, yPos + 20);
  } else {
    fill(150, 100, 0);
    text('⚠ Press any key', 140, yPos);
  }

  yPos += 60;

  // Webcam status
  fill(0);
  text('📷 Webcam:', 10, yPos);
  if (capture && capture.loadedmetadata) {
    fill(0, 150, 0);
    text('✓ Active', 140, yPos);
    // Show webcam feed
    image(capture, 10, yPos + 20, 160, 120);
  } else {
    fill(150, 0, 0);
    text('✗ Not enabled', 140, yPos);
  }

  yPos += 160;

  // Speakers status
  fill(0);
  text('🔊 Speakers:', 10, yPos);
  if (audioContext && audioContext.state === 'running') {
    fill(0, 150, 0);
    text('✓ Active', 140, yPos);
    if (isPlayingSound) {
      fill(0, 200, 0);
      text('♪ Playing tone', 10, yPos + 20);
    }
  } else {
    fill(150, 100, 0);
    text('⚠ Click to test', 140, yPos);
  }

  // Instructions
  fill(100);
  textSize(11);
  text('Click canvas to enable mic/speakers', 10, 380);
}

function mousePressed() {
  // Start microphone
  if (mic && !mic.enabled) {
    mic.start();
  }

  // Play a test tone (speakers)
  if (!audioContext) {
    audioContext = getAudioContext();
  }

  if (audioContext.state !== 'running') {
    audioContext.resume();
  }

  // Play a short tone
  if (!isPlayingSound) {
    isPlayingSound = true;
    let osc = new p5.Oscillator('sine');
    osc.freq(440);
    osc.amp(0.2);
    osc.start();
    setTimeout(() => {
      osc.stop();
      isPlayingSound = false;
    }, 200);
  }
}

function keyPressed() {
  // Record last key pressed
  if (key.length === 1) {
    lastKey = key;
  } else {
    lastKey = keyCode + '';
  }
  return false;
}
