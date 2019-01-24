var canvas = document.querySelector("#main");
var ctx = canvas.getContext("2d");

var originRadius = canvas.height;
var frequency = 600;
var acceleration = 1;
gameLauncher();
var firstTry = true;

var blue = "#00fFFF";
var blueRgb = "0, 255, 255";
var red = "#FF24F0";
var redRgb = "255, 39, 240";
var black = "#000000";
var neutralColor = "#ffffff";

var purple = "#b4136c";
var purpleRgb = "180, 19, 108";
var orange = "#e77500";
var orangeRgb = "231, 117, 0";
var green = "#08f0b0";
var greenRgb = "#8, 240, 176";
var yellow = "#FFE98D";
var yellowRgb = "255, 233, 141";

var orbHits = 1;
var energy = 50;
var energyHit = 12;
var energyBlock = 3;
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
  gameLaunched = false;
  firstTry = false;
  clearTimeout(gameStart);
  frequency = 600;
  document.onkeypress = function(event) {
    $(".popup").addClass("hidden");
    if (gameLaunched === false) {
      launchGame();
      gameLaunched = true;
      firstTry = false;
    }
  };
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
  console.log(orbHits);
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
  console.log("hello");
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
  rgb: yellowRgb,

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
          // console.log(energy);
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

          // console.log(energy);

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
    this.dAlpha = 0.77;

    this.x = shield.x;
    this.y = shield.y;
    this.r = shield.r;
    this.rgb = shield.rgb;
    this.dr = 1;
    this.generate();
  }
  generate() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(" + this.rgb + ", " + this.opacity + ")";
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
    this.opacity = 0.99;
    this.dAlpha = 0.99;
    this.rgb = shield.rgb;

    this.x = shield.x;
    this.y = shield.y - shield.r;
    this.r = 10;
    this.dr = 0.0003;
  }
  generate() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

    ctx.fillStyle = "rgba(" + this.rgb + ", " + this.opacity + ")";
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
  // frequencyUP();
  if (energy <= 0) {
    checkGameOver();
    return;
  }

  setTimeout(newOrb, frequency);
}
function launchGame() {
  multiplier = 0;
  energy = 50;
  score = 0;
  allOrbs = [];
  allPulses = [];
  allImpacts = [];
  gameStart = setTimeout(newOrb, frequency);
  clearInterval(blinkTimer);
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

  allImpacts.forEach(function(oneImpact) {
    oneImpact.generate();
  });

  shield.generate();
  core.generate();
}

setInterval(draw, 10);

var fireA = false;
var fireB = false;
var fireC = false;

var burnEnergyTimerA;
var burnEnergyTimerB;
var burnEnergyTimerC;

document.onkeydown = function(event) {
  switch (event.keyCode) {
    case 37: //left arrow
      shield.isBlue = true;

      if (!burnEnergyTimerA) {
        burnEnergyTimerA = setInterval(burnEnergy, 100);
      }
      allImpacts.push(new impact());

      if (!fireA) {
        fireA = true;
        allPulses.push(new pulse());
      }

      event.preventDefault();

      break;
    case 38: //up
      shield.isRed = true;

      if (!burnEnergyTimerB) {
        burnEnergyTimerB = setInterval(burnEnergy, 100);
      }

      if (!fireB) {
        fireB = true;
        allPulses.push(new pulse());
      }
      event.preventDefault();

      break;
    case 39: //right
      shield.isYellow = true;

      if (!burnEnergyTimerC) {
        burnEnergyTimerC = setInterval(burnEnergy, 100);
      }

      if (!fireC) {
        fireC = true;
        allPulses.push(new pulse());
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
      clearInterval(burnEnergyTimerA);
      burnEnergyTimerA = null;

      event.preventDefault();

      break;
    case 38: //up
      shield.isRed = false;
      fireB = false;
      clearInterval(burnEnergyTimerB);
      burnEnergyTimerB = null;

      event.preventDefault();

      break;
    case 39: //right
      shield.isYellow = false;
      fireC = false;
      clearInterval(burnEnergyTimerC);
      burnEnergyTimerC = null;

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
    shield.rgb = purpleRgb;
  } else if (shield.isRed === true && shield.isYellow === true) {
    shield.color = orange;
    shield.rgb = orangeRgb;
  } else if (shield.isBlue === true && shield.isYellow === true) {
    shield.color = green;
    shield.rgb = greenRgb;
  } else if (shield.isRed === true) {
    shield.color = red;
    shield.rgb = redRgb;
  } else if (shield.isBlue === true) {
    shield.color = blue;
    shield.rgb = blueRgb;
  } else {
    shield.color = yellow;
    shield.rgb = yellowRgb;
  }
}

function checkSounds() {
  sounds[1].play();
  sounds[4].play();
  console.log("poum");
  if (orbHits % 2 === 0) {
    sounds[0].play();
    console.log(orbHits);
  }
  if ((orbHits + 1) % 4 === 0 && orbHits > 1) {
    sounds[2].play();
    sounds[3].play();
  }
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
  }
  if (orbHits % 16 === 0 && orbHits > 15) {
  }
  orbHits += 1;
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
    blinkTimer = setInterval(blink_text, 1000);
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
