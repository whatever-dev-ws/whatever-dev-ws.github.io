let ballX = 200;
let ballY = 200;
let speedX = 3;
let speedY = 2;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(135, 206, 235);

  // Move the ball
  ballX += speedX;
  ballY += speedY;

  // Bounce off edges
  if (ballX > width - 25 || ballX < 25) {
    speedX *= -1;
  }
  if (ballY > height - 25 || ballY < 25) {
    speedY *= -1;
  }

  // Draw the ball
  fill(255, 200, 0);
  noStroke();
  ellipse(ballX, ballY, 50, 50);

  // Draw text
  fill(0);
  textAlign(CENTER, TOP);
  textSize(16);
  text('Bouncing Ball', 200, 20);
}
