import utils, {
  distance,
  randomColor,
  randomIntFromRange,
  resolveCollision,
} from "./utils";

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

const colors = ["#2185C5", "#7ECEFD", "#FF7F66"];
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
class Particle {
  constructor(x, y, radius, color, mov = true) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mov = mov;
    this.velocity = {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5,
    };
    this.mass = 1;
    this.opacity = 0;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  }

  update(particles) {
    for (let i = 0; i < particles.length; i++) {
      if (this === particles[i]) continue;

      if (
        distance(this.x, this.y, particles[i].x, particles[i].y) -
          this.radius * 2 <
        0
      )
        resolveCollision(this, particles[i]);
    }
    if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
      this.velocity.x = -this.velocity.x; //* friction;
    }
    if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
      this.velocity.y = -this.velocity.y; //* friction;
    }

    //Mouse collision detection
    if (distance(mouse.x, mouse.y, this.x, this.y) < 120 && this.opacity < 0.2)
      this.opacity += 0.02;
    else if (this.opacity > 0) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
}

// Implementation
let particles;
function init() {
  particles = [];

  for (let i = 0; i < 100; i++) {
    const radius = 15;
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(radius, canvas.height - radius);
    const color = randomColor(colors);
    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0) {
          x = randomIntFromRange(radius, canvas.width - radius);
          y = randomIntFromRange(radius, canvas.height - radius);
          j = -1;
        }
      }
    }
    particles.push(new Particle(x, y, radius, color));
  }
}
//Bounce
// const bounce = function (m, c1, c2) {
//   c1.dx = m.dx * friction;
//   c1.dy = m.dy * friction;
// };
// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // circle1.update();
  // circle2.update();
  // let distance =
  //   utils.distance(circle1.x, circle1.y, circle2.x, circle2.y) -
  //     circle1.radius -
  //     circle2.radius <=
  //   0;

  // circle2.x = mouse.x;
  // circle2.y = mouse.y;
  // if (distance) {
  //   circle1.color = "red";
  //   bounce(mouse, circle1, circle2);
  // } else {
  //   circle1.color = "black";
  // }
  particles.forEach((particle) => {
    particle.update(particles);
  });
}

init();
animate();
