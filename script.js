var canvas = document.querySelector("#main");
var ctx = canvas.getContext("2d");

var originRadius = canvas.height;
var frequency = 600;
var acceleration = 1;
gameLauncher();
var firstTry = true;

var blue = "#00fFFF";
var red = "#FF24F0";
var black = "#000000";
var neutralColor = "#ffffff";
var purple = "#b4136c";
var orange = "#e77500";
var green = "#08f0b0";
var yellow = "#FFE98D";

var energy = 65;
var energyHit = 20;
var energyBlock = 5;
var score = 0;
var scoreBlock = 100;
var multiplier = 1;
var multiplierCheck = 0;
var combo = 0;

var orbCount = 0;

function scoreCalc() {
  multiplierCalc();
  score = scoreBlock * multiplier;
}
function multiplierCalc() {
  multiplierCheck++;
  combo++;
  if (multiplierCheck > 3) {
    multiplier += 0.1;
  }
}

function checkGameOver() {
  $(".popup").removeClass("hidden");
  $(".start").addClass("hidden");
  $(".restart").removeClass("hidden");
  multiplier = 0;
  score = 0;
  gameLaunched = false;
  firstTry = false;
  clearTimeout(gameStart);
  frequency = 700;
}

function frequencyUP() {
  orbCount++;
  if (orbCount % 32 === 0) {
    frequency -= 10;
    console.log("UP UP ");
  }
}
function hit() {
  checkSounds();

  if (energy < 96) {
    energy += energyBlock;
  } else if (96 <= energy <= 100) {
    energy = 100;
  }
  scoreCalc();
  allOrbs.shift();
}
function miss() {
  orbHits++;
  energy -= energyHit;
  comboReset();
  allOrbs.shift();
}

function comboReset() {
  multiplierCheck = 0;
  combo = 0;
}
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
    if (this.origin === "left") {
      this.x = shield.x - originRadius;
      this.y = shield.y;
    } else if (this.origin === "top") {
      this.x = shield.x;
      this.y = shield.y - originRadius;
    } else if (this.origin === "right") {
      this.x = shield.x + originRadius;
      this.y = shield.y;
    }

    this.r = 7;
    this.dr = 1;
    this.dx = 1;
    this.dy = 1;
    this.isHit = false;
    this.isBlock = false;
    this.vulnerable = false;
    this.hit = false;
  }

  checkVulnerable() {
    switch (this.origin) {
      case "top":
        if (
          this.y > shield.y - (shield.r + 5) &&
          this.y < shield.y - (shield.r - 4)
        ) {
          this.vulnerable = true;
        } else {
          this.vulnerable = false;
        }

        break;
      case "left":
        if (
          this.x > shield.x - (shield.r + 5) &&
          this.x < shield.x - (shield.r - 4)
        ) {
          this.vulnerable = true;
        } else {
          this.vulnerable = false;
        }

        break;
      case "right":
        if (
          this.x < shield.x + (shield.r + 5) &&
          this.x > shield.x + (shield.r - 4)
        ) {
          this.vulnerable = true;
        } else {
          this.vulnerable = false;
        }

        break;
    }
  }

  checkHit() {
    switch (this.origin) {
      case "top":
        if (this.y > shield.y - ((energy * shield.r) / 100 - 5)) {
          this.isHit = true;

          miss();
        }
        break;
      case "left":
        if (this.x > shield.x - ((energy * shield.r) / 100 - 5)) {
          this.isHit = true;
          miss();
        }
        break;
      case "right":
        if (this.x < shield.x + ((energy * shield.r) / 100 - 5)) {
          this.isHit = true;
          miss();
        }
        break;
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
          this.isBlock = true;
          console.log(energy);
          hit();
        }

        break;
      case red:
        if (
          (this.vulnerable === true && this.color === shield.color) ||
          (this.vulnerable === true && shield.color === purple) ||
          (this.vulnerable === true && shield.color === orange)
        ) {
          //console.log("bloque");

          this.isBlock = true;
          hit();
        }
        break;
      case yellow:
        if (
          (this.vulnerable === true && this.color === shield.color) ||
          (this.vulnerable === true && shield.color === green) ||
          (this.vulnerable === true && shield.color === orange)
        ) {
          this.isBlock = true;
          checkSounds();
          console.log(energy);

          hit();
        }
        break;
    }
  }

  generate() {
    switch (this.origin) {
      case "top":
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        // this.y *= this.dy;
        // this.r *= this.dr;
        this.y += this.dy * acceleration;
        this.r *= this.dr;
        this.checkShield();
        this.checkVulnerable();

        this.checkHit();

        break;
      case "left":
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        // this.y *= this.dy;
        // this.r *= this.dr;
        this.x += this.dx * acceleration;
        this.r *= this.dr;
        this.checkShield();
        this.checkVulnerable();

        this.checkHit();
        break;
      case "right":
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        // this.y *= this.dy;
        // this.r *= this.dr;
        this.x -= this.dx * acceleration;
        this.r *= this.dr;
        this.checkShield();
        this.checkVulnerable();

        this.checkHit();
        break;
    }
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
class impact {
  // constructor is a special method that gets called when you create the object
  // used  for defining the objects' initial keys/properties
  constructor(impactColor, impactOrigin) {
    //"this" is the generic name you use to REFER TO THE NEW OBJECT
    this.color = impactColor;
    this.origin = impactOrigin;
    this.opacity = 0.8;
    this.dAlpha = 0.8;

    this.x = shield.x;
    this.y = shield.y - shield.r;
    this.r = 50;
    this.dr = 0.0003;
    this.generate();
  }
  generate() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

    ctx.fillStyle = "rgba(200, 0, 0, " + this.opacity + ")";
    ctx.fill();
    ctx.closePath();
    this.opacity *= this.dAlpha;
    this.r += this.dr;
    if (this.opacity < 1e-100000000000000000) {
      allImpacts.shift();
      console.log("impact disparu");
    }
  }
}

allOrbs = [];
allPulses = [];
allImpacts = [];

function newOrb() {
  allOrbs.push(new orb(randomColor(), randomOrigin()));
  frequencyUP();
  if (energy <= 0) {
    checkGameOver();
    return;
  }

  setTimeout(newOrb, frequency);
}
function launchGame() {
  var gameStart = setTimeout(newOrb, frequency);
}

function draw() {
  //   ctx.fillStyle = 'rgba(255,255,255,0.3)';
  // ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  allPulses.forEach(function(pulse) {
    pulse.generate();
  });

  allOrbs.forEach(function(oneOrb) {
    oneOrb.generate();
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
      allImpacts.push(new impact());

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

function randomColor() {
  var randomNumber = Math.floor(Math.random() * Math.floor(3));
  if (randomNumber === 0) {
    return blue;
  }
  if (randomNumber === 1) {
    return red;
  }
  if (randomNumber === 2) {
    return yellow;
  }
}

function randomOrigin() {
  var randomNumber = Math.floor(Math.random() * Math.floor(3));
  if (randomNumber === 0) {
    return "top";
  }
  if (randomNumber === 1) {
    return "left";
  }
  if (randomNumber === 2) {
    return "right";
  }
}

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

var orbHits = 1;
function checkSounds() {
  sounds[1].play();

  sounds[4].play();
  if (orbHits % 2 === 0) {
    sounds[0].play();
  }
  // if ((orbHits + 1) % 4 === 0 && orbHits > 1) {
  //   sounds[2].play();
  //   sounds[3].play();
  // }
  // if ((orbHits - 1) % 8 === 0 && orbHits > 3) {
  //   if ((orbHits = 49)) {
  //     sounds[8].play();
  //   } else if ((orbHits = 33)) {
  //     sounds[7].play();
  //   } else if ((orbHits = 17)) {
  //     sounds[6].play();
  //   } else sounds[5].play();
  // }
  if (orbHits % 8 === 0) {
    console.log("truc");
  }
  if (orbHits % 16 === 0 && orbHits > 15) {
    console.log("gros truc");
  }
  orbHits++;
}

var sounds = [
  new Audio("./sounds/04.wav"),
  new Audio("./sounds/06.wav"),
  new Audio("./sounds/0O.wav"),
  new Audio("./sounds/1T.wav"),
  new Audio("./sounds/4E.wav"),
  new Audio("./sounds/23.wav"),
  new Audio("./sounds/24.wav"),
  new Audio("./sounds/25.wav"),
  new Audio("./sounds/26.wav")
];

// $(".start").click(function() {
//   $(".popup").addClass("hidden");
//   launchGame();
// });
gameLauncher();
var gameLaunched = false;

function gameLauncher() {
  if (firstTry === true) {
    // setInterval(blink_text, 1000);
    document.onkeypress = function(event) {
      $(".popup").addClass("hidden");
      if (gameLaunched === false) {
        launchGame();
        gameLaunched === true;
        firstTry = false;
      }
    };
  }
  return;
}
function blink_text() {
  $(".start").fadeOut(500);
  $(".start").fadeIn(500);
}

// QUAND LE JEU EST FINI, POUR FAIRE APPARAITRE LE POP UP END :
// $(".popup").removeClass("hidden");
// $(".start").addClass("hidden");
// $(".restart").removeClass("hidden");
