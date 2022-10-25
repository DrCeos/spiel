let KEY_SPACE = false; // 32
let KEY_UP = false; // 38
let KEY_DOWN = false; //40
let canvas;
let ctx;
let backgroundImage = new Image();
let shootInterval
let points = 0

let rocket = {
  x: 100,
  y: 100,
  width: 150,
  height: 60,
  src: `img/rocket.png`,
};

let ufos = [];

let shoots = [];

document.onkeydown = function (e) {
  if (e.keyCode == 32) {
    // Leertaste gedrückt
    KEY_SPACE = true;
  }

  if (e.keyCode == 38) {
    // Nach oben gedrückt
    KEY_UP = true;
  }

  if (e.keyCode == 40) {
    // Nach unten gedrückt
    KEY_DOWN = true;
  }
};

document.onkeyup = function (e) {
  if (e.keyCode == 32) {
    // Leertaste loslassen
    KEY_SPACE = false;
  }

  if (e.keyCode == 38) {
    // Nach oben loslassen
    KEY_UP = false;
  }

  if (e.keyCode == 40) {
    // Nach unten loslassen
    KEY_DOWN = false;
  }
};

function startGame() {
  canvas = document.getElementById(`canvas`);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext(`2d`);
  ctx.lineWidth = 10
  ctx.fillStyle = "white"
  ctx.font = "35px arial"

  loadImages();
  setInterval(update, 1000 / 144);
  setInterval(createUfos, 2000);
  setInterval(checkForCollision, 1000 / 144);
  setInterval(checkForShoot, 1000 / 144);
  setInterval(checkForBoom, 1000 / 144)
  setInterval(resetShootInterval, 250)
  draw();
  // calculate
}

function checkForCollision() {
  ufos.forEach((ufo) => {
    if (
      rocket.x + rocket.width > ufo.x &&
      rocket.y + rocket.height > ufo.y &&
      rocket.x < ufo.x &&
      rocket.y < ufo.y
    ) {
      rocket.img.src = "img/boom.png";
      console.log(`Collision`);
      ufos = ufos.filter((u) => u != ufo);
    }
  });
}

function resetShootInterval() {
  shootInterval = false
}

function checkForBoom() {
  shoots.forEach((shoot) => {
    ufos.forEach((ufo) => {
    if (
      ufo.x + ufo.width > shoot.x &&
      ufo.y + ufo.height > shoot.y &&
      ufo.x < shoot.x &&
      ufo.y < shoot.y
    ){
      ufo.img.src = "img/boom.png";

      setTimeout(() => {
        let tempUfos = ufos.filter((u) => {
          return u != ufo
        })
        points += ufos.length - tempUfos.length;
        ufos = tempUfos
      }, 750)

    }
  })
})
}

function checkForShoot() {
  if(shootInterval == true) return
  if (KEY_SPACE) {
    let shoot = {
      x: rocket.x + 140,
      y: rocket.y + 27,
      width: 60,
      height: 12,
      src: "img/shoot.png",
      img: new Image(),
    };
    shoot.img.src = shoot.src;
    shoots.push(shoot);
    shootInterval = true
  }
}

function createUfos() {
  let ufo = {
    x: window.innerWidth,
    y: 200,
    width: 100,
    height: 40,
    src: `img/ufo.png`,
    img: new Image(),
  };
  ufo.img.src = ufo.src; //Ufo-Bild wird geladen
  ufo.y = getRndInteger(10, window.innerHeight - 10);
  ufos.push(ufo);
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function update() {
  //Punkte hinzufügen


  ufos.forEach(function (ufo) {
    ufo.x -= 2;
  });

  shoots.forEach(function (shoot) {
    shoot.x += 6;
  });

  if (KEY_UP) {
    if (rocket.y <= 10) return;
    rocket.y -= 4;
  }

  if (KEY_DOWN) {
    if (rocket.y + 60 > window.innerHeight) return;
    rocket.y += 4;
  }
} // lol

function isOutsideBorder() {
  return rocket.y > 0 && rocket.y + rocket.height < window.innerHeight;
}

function loadImages() {
  backgroundImage.src = `img/background.jpg`;
  console.log(backgroundImage);
  rocket.img = new Image();
  rocket.img.src = rocket.src;
}

function draw() {
  ctx.drawImage(
    backgroundImage,
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );
  ctx.drawImage(
    rocket.img,
    rocket.x,
    rocket.y,
    rocket.width,
    rocket.height
  );
  ufos.forEach(function (ufo) {
    ctx.drawImage(ufo.img, ufo.x, ufo.y, ufo.width, ufo.height);
  });
  shoots.forEach(function (shoot) {
    ctx.drawImage(shoot.img, shoot.x, shoot.y, shoot.width, shoot.height);
  });
  let textWidth = ctx.measureText(`Punkte: ${points}`).width
  ctx.fillText(`Punkte: ${points}`, window.innerWidth / 2 - (textWidth / 2), 50)
  requestAnimationFrame(draw);
}