var canvas = document.querySelector(".testJeu");
var ctx = canvas.getContext("2d");

var blue = "#0095DD";
var red = "#f20000";
var black = "#000000";
var neutralColor = "#5a0936";
var purple = "#b4136c";
var orange = "#e77500";
var green = "#08f0b0";
var yellow = "#ecd606";
var energy = 65;

function burnEnergy() {
  energy -= 1;
}
function stopBurnEnergy() {
  clearInterval(burnEnergyTimer);
}

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
    setColor();
    ctx.lineWidth = 3;
    ctx.strokeStyle = shield.color;
    ctx.stroke();
    ctx.closePath();
  }
};

var core = {
  x: shield.x,
  y: shield.y,

  color: neutralColor,

  generate: function() {
    ctx.beginPath();
    ctx.arc(shield.x, shield.y, (energy * shield.r) / 100, 0, Math.PI * 2);
    setColor();

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
    this.dr = 1;
    this.dx = 2;
    this.dy = 1;
    this.isHit = false;
    this.isBlock = false;
    this.vulnerable = false;
    this.hit = false;
  }

  checkVulnerable() {
    if (
      this.y > shield.y - (shield.r + 5) &&
      this.y < shield.y - (shield.r - 4)
    ) {
      this.vulnerable = true;
    } else {
      this.vulnerable = false;
    }
  }
  checkHit() {
    if (this.y > shield.y - (energy * shield.r) / 100) {
      this.isHit = true;
      console.log("touche");
      energy -= 10;
      allOrbs.shift();
    }
  }

  checkShield() {
    switch (this.color) {
      case blue:
        if (
          (this.vulnerable === true && this.color === shield.color) ||
          (this.vulnerable === true && shield.color === purple) ||
          (this.vulnerable === true && shield.color === green)
        ) {
          console.log(energy);
          this.isBlock = true;
          if (energy < 96) {
            energy += 5;
          } else if (96 <= energy <= 100) {
            energy = 100;
          }
          allOrbs.shift();
        }

        break;
      case red:
        if (
          (this.vulnerable === true && this.color === shield.color) ||
          (this.vulnerable === true && shield.color === purple) ||
          (this.vulnerable === true && shield.color === orange)
        ) {
          console.log("bloque");
          this.isBlock = true;
          allOrbs.shift();
        }
        break;
      case yellow:
        if (
          (this.vulnerable === true && this.color === shield.color) ||
          (this.vulnerable === true && shield.color === green) ||
          (this.vulnerable === true && shield.color === orange)
        ) {
          console.log("bloque");
          this.isBlock = true;
          allOrbs.shift();
        }
        break;
    }
  }

  generate() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // this.y *= this.dy;
    // this.r *= this.dr;
    this.y += this.dy;
    this.r *= this.dr;
    this.checkShield();
    this.checkVulnerable();

    this.checkHit();
  }
}
class pulse {
  // constructor is a special method that gets called when you create the object
  // used  for defining the objects' initial keys/properties
  constructor() {
    //"this" is the generic name you use to REFER TO THE NEW OBJECT
    this.opacity = 1;
    this.dAlpha = 0.8;

    this.x = shield.x;
    this.y = shield.y;
    this.r = shield.r;
    this.dr = 1;
    this.generate();
  }
  generate() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(200, 0, 0, " + this.opacity + ")";
    ctx.stroke();
    ctx.closePath();
    this.opacity *= this.dAlpha;
    this.r += this.dr;
    if (this.opacity < 1e-10) {
      allPulses.shift();
    }
  }
}

allOrbs = [];
allPulses = [];

function newOrb() {
  allOrbs.push(new orb(blue, top));
}
setInterval(newOrb, 1000);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  allOrbs.forEach(function(oneOrb) {
    oneOrb.generate();
  });
  allPulses.forEach(function(pulse) {
    pulse.generate();
  });
  shield.generate();
  core.generate();
}

setInterval(draw, 10);

var fireA = false;
var fireB = false;
var fireC = false;

document.onkeydown = function(event) {
  switch (event.keyCode) {
    case 37: //left arrow
      shield.isBlue = true;
      burnEnergyTimerA = setInterval(burnEnergy, 100);
      console.log("brule");
      if (!fireA) {
        fireA = true;
        allPulses.push(new pulse());
      }

      event.preventDefault();

      break;
    case 38: //up
      shield.isRed = true;
      burnEnergyTimerB = setInterval(burnEnergy, 100);

      if (!fireB) {
        fireB = true;
        allPulses.push(new pulse());
      }
      event.preventDefault();

      break;
    case 39: //right
      shield.isYellow = true;
      if (!fireC) {
        fireC = true;
        allPulses.push(new pulse());
        burnEnergyTimerC = setInterval(burnEnergy, 100);
      }
      event.preventDefault();

      break;
    case 40: //down
      event.preventDefault();

      break;
  }
};

document.onkeyup = function(event) {
  // pulseColorCheck.push(shield.color);

  switch (event.keyCode) {
    case 37: //left
      shield.isBlue = false;
      fireA = false;
      for (i = 0; i < 10000; i++) {
        clearInterval(burnEnergyTimerA);
      }
      event.preventDefault();

      break;
    case 38: //up
      shield.isRed = false;
      fireB = false;
      clearInterval(burnEnergyTimerB);

      event.preventDefault();

      break;
    case 39: //right
      shield.isYellow = false;
      fireC = false;
      clearInterval(burnEnergyTimerC);

      event.preventDefault();

      break;

    case 40: //down
      event.preventDefault();

      break;
  }
};

function setColor() {
  if (
    shield.isBlue === false &&
    shield.isRed === false &&
    shield.isYellow === false
  ) {
    shield.color = neutralColor;
  } else if (shield.isBlue === true && shield.isRed === true) {
    shield.color = purple;
  } else if (shield.isRed === true && shield.isYellow === true) {
    shield.color = orange;
  } else if (shield.isBlue === true && shield.isYellow === true) {
    shield.color = green;
  } else if (shield.isRed === true) {
    shield.color = red;
  } else if (shield.isBlue === true) {
    shield.color = blue;
  } else {
    shield.color = yellow;
  }
}
