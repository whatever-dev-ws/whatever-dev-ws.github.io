function setup() {
  createCanvas(400, 400);
  background(240);
  frameRate(2);
}

function draw() {
  // Random position
  let x = random(50, 350);
  let y = random(50, 350);
  let size = random(20, 60);

  // Random color
  let r = random(255);
  let g = random(255);
  let b = random(255);
  fill(r, g, b, 150);
  stroke(0, 50);
  strokeWeight(2);

  // Random shape
  let shapeType = floor(random(3));
  if (shapeType === 0) {
    ellipse(x, y, size, size);
  } else if (shapeType === 1) {
    rectMode(CENTER);
    rect(x, y, size, size);
  } else {
    triangle(x, y - size / 2, x - size / 2, y + size / 2, x + size / 2, y + size / 2);
  }

  // Draw title
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text('Random Shapes', 200, 20);
}

