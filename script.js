var canvas = document.querySelector(".testJeu");
var ctx = canvas.getContext("2d");

// var x = canvas.width / 2;
// var y = canvas.height - canvas.height;
// var dx = 2;
// var dy = +2;

var blue = "#0095DD";
var red = "#f20000";
var neutralColor = "#5a0936";

var shield = {
  x: canvas.width / 2,
  y: canvas.height - canvas.height / 4,
  r: 50,
  isRed: false,
  isBlue: false,
  isGreen: false,
  isYellow: false,
  isOrange: false,
  isPurple: false,
  isWhite: false,

  color: neutralColor,
  generate: function() {
    ctx.beginPath();
    ctx.arc(shield.x, shield.y, shield.r, 0, Math.PI * 2);
    ctx.fillStyle = shield.color;
    ctx.fill();
    ctx.closePath();
  }
};

class orb {
  // constructor is a special method that gets called when you create the object
  // used  for defining the objects' initial keys/properties
  constructor(orbColor, orbOrigin) {
    //"this" is the generic name you use to REFER TO THE NEW OBJECT
    this.color = orbColor;

    this.origin = orbOrigin;
    this.x = canvas.width / 2;
    this.y = 20;
    this.r = 7;
    this.dr = 0.99;
    this.dx = 2;
    this.dy = 1.05;
    this.isHit === false;
    this.isBlock === false;
    this.generate();
  }
  checkShield() {
    if (this.y >= shield.y - shield.r) {
      console.log("coucou");
      this.isHit === true;
      allOrbs.shift();
    }
  }

  generate() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    // change this
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    //console.log("coucou");
    this.y *= this.dy;
    this.r *= this.dr;
    this.checkShield();
  }
}
allOrbs = [];
allOrbs.push(new orb(blue, top));

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  allOrbs.forEach(function(oneOrb) {
    oneOrb.generate();
  });
  shield.generate();
}

//}
// // function drawBall() {
// //   ctx.beginPath();
// //   ctx.arc(x, y, 10, 0, Math.PI * 2);
// //   ctx.fillStyle = "#0095DD";
// //   ctx.fill();
// //   ctx.closePath();

setInterval(draw, 10);

document.onkeydown = function(event) {
  console.log("coucou KEY DOWN " + event.keyCode);
  switch (event.keyCode) {
    case 37: //left arrow
      shield.isBlue = true;
      event.preventDefault();

      break;
    case 38: //up
      event.preventDefault();

      break;
    case 39: //right
      event.preventDefault();

      break;
    case 40: //down
      event.preventDefault();

      break;
  }
};

document.onkeyup = function(event) {
  console.log("coucou KEY UP " + event.keyCode);
  switch (event.keyCode) {
    case 37: //left arrow
      shield.isBlue = false;
      event.preventDefault();

      break;
    case 38: //up
      event.preventDefault();

      break;
    case 39: //right
      event.preventDefault();

      break;
    case 40: //down
      event.preventDefault();

      break;
  }
};

function setColor() {}
