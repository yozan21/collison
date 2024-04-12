import utils, { distance } from "./utils";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: 100,
  y: 100,
  dx: undefined,
  dy: undefined,
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];
const friction = 0.99;
// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.dx = event.movementX;
  mouse.dy = event.movementY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

// Objects
class Circle {
  constructor(x, y, radius, color, mov) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mov = mov;
    this.dx = 0;
    this.dy = 0;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    if (!this.mov) {
      if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
        this.dx = -this.dx * friction;
      }
      if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
        this.dy = -this.dy * friction;
      }
      this.x += this.dx;
      this.y += this.dy;
    }
    this.draw();
  }
}

// Implementation
let circles;
let circle1;
let circle2;
function init() {
  circles = [];
  circle1 = new Circle(innerWidth / 2, innerHeight / 2, 60, "black", false);
  circle2 = new Circle(100, 100, 30, "red", true);
  for (let i = 0; i < 400; i++) {
    // objects.push()
  }
}
//Bounce
const bounce = function (m, c1, c2) {
  c1.dx = m.dx * friction;
  c1.dy = m.dy * friction;
};
// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  circle1.update();
  circle2.update();
  let distance =
    utils.distance(circle1.x, circle1.y, circle2.x, circle2.y) -
      circle1.radius -
      circle2.radius <=
    0;

  circle2.x = mouse.x;
  circle2.y = mouse.y;
  if (distance) {
    circle1.color = "red";
    bounce(mouse, circle1, circle2);
  } else {
    circle1.color = "black";
  }
  // objects.forEach(object => {
  //  object.update()
  // })
}

init();
animate();
