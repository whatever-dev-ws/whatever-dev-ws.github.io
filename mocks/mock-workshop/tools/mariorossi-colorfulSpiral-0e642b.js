let angle = 0;
let radius = 0;

function setup() {
  createCanvas(400, 400);
  background(20);
}

function draw() {
  translate(width / 2, height / 2);

  // Calculate position on spiral
  let x = cos(angle) * radius;
  let y = sin(angle) * radius;

  // Color based on angle
  let hue = (angle * 10) % 360;
  colorMode(HSB);
  fill(hue, 80, 90);
  noStroke();

  // Draw circle
  ellipse(x, y, 8, 8);

  // Update angle and radius
  angle += 0.1;
  radius += 0.3;

  // Reset when spiral gets too big
  if (radius > 180) {
    background(20);
    radius = 0;
    angle = 0;
  }

  // Draw text
  colorMode(RGB);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Colorful Spiral', 0, -180);
}

