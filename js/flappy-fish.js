"use strict";

// #0: Lyt efter side indlæsning
window.addEventListener("load", initApp);

let allFish = []; // Globalt array til at holde alle fisk

// #1: Initialiser appen
function initApp() {
  console.log("initApp: app.js kører 🎉");
  getFish(); // Henter fiskene
}

// #2: Hent fisk fra JSON og vis dem
async function getFish() {
  console.log("🌐 Henter alle fisk fra JSON...");
  try {
    const response = await fetch("./JSON/fish.json");
    const data = await response.json();
    allFish = data.fish; // Hent fisk-arrayet fra JSON
    console.log(`📊 JSON data modtaget: ${allFish.length} fisk`);
  } catch (error) {
    console.error("❌ Fejl under hentning af fisk:", error);
  }
}

// --- Canvas setup + hiDPI skalering ----------------------------------------
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeForHiDPI() {
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1)); // cap for performance
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // tegn i CSS-px
}
resizeForHiDPI();
window.addEventListener("resize", resizeForHiDPI);

const W = () => canvas.clientWidth;
const H = () => canvas.clientHeight;

// --- Indlæs dine PNG-assets --------------------------------------------------
const assets = {
  fish: new Image("../images/palet-kirurg-flappy.png"),
  top: new Image("../images/tang-flappy-omvendt.png"),
  bottom: new Image("../images/tang-flappy.png"),
};
assets.fish.src = "images/palet-kirurg-flappy.png";
assets.top.src = "images/tang-flappy-omvendt.png";
assets.bottom.src = "images/tang-flappy.png";

// Vent (kort) på assets — hvis de ikke når at loade, tegner vi bare senere
let imagesReady = false;
let imagesLoaded = 0;
Object.values(assets).forEach((img) => {
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === Object.keys(assets).length) imagesReady = true;
  }; 
});

// --- Spil-konstanter ---------------------------------------------------------
const GRAVITY = 1800; // px/s^2
const JUMP_VELOCITY = -520; // px/s
const FISH_W = 120,
  FISH_H = 72; 
const PIPE_W = 70;
const GAP_MIN = 300,
  GAP_MAX = 330;
const PIPE_SPEED = 220; // px/s 
const SPAWN_EVERY = 1.5; // s
const SEA_FLOOR_H = 0; // bund-kollision


// --- Opdater "Tryk her" knap synlighed ---------------------------------------
function updateTrykHerBtn() {
  const btn = document.getElementById("flappy-tryk-her");
  if (!btn) return;
  if (gameState === "ready" || gameState === "gameover") {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}

// --- Spil-tilstand -----------------------------------------------------------
let gameState = "ready"; // 'ready' | 'playing' | 'paused' | 'gameover'
let fish, 
  pipes,
  score,
  best = 0,
  timeSinceSpawn = 0;

// Start/Reset
function resetGame() {
  fish = { x: W() * 0.25, y: H() * 0.45, vy: 0, rot: 0 };
  pipes = [];
  score = 0;
  timeSinceSpawn = 0;
  gameState = "ready";
  addVisibleStartPipes(); // Pipes er synlige fra midten og  til højre kant
  updateTrykHerBtn(); // Opdater knap synlighed
}
resetGame();

// --- Input -------------------------------------------------------------------
function flap() {
  if (gameState === "ready") gameState = "playing"; updateTrykHerBtn();
  if (gameState === "gameover") {
    resetGame();
    return;
  }
  if (gameState !== "paused") fish.vy = JUMP_VELOCITY;
}
function togglePause() {
  if (gameState === "playing") gameState = "paused";
  else if (gameState === "paused") gameState = "playing";
}
function restart() {
  resetGame();
}

canvas.addEventListener("pointerdown", flap, { passive: true });
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    flap();
  }
  if (e.key.toLowerCase() === "p") togglePause();
  if (e.key.toLowerCase() === "r") restart();
});

// --- Hjælpere ----------------------------------------------------------------
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnPipe(startVisible = false) {
  const gap = rand(GAP_MIN, GAP_MAX);
  const topH = rand(40, H() - SEA_FLOOR_H - 40 - gap);
  const bottomY = topH + gap;
  // Hvis startVisible er true, placer pipe inde på skærmen
  const x = startVisible ? W() / 2 : W() + PIPE_W;
  pipes.push({
    x,
    top: { y: 0, h: topH },
    bottom: { y: bottomY, h: H() - SEA_FLOOR_H - bottomY },
    passed: false,
  });
}

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}


// --- Synlige pipes ----
function addVisibleStartPipes() {
  const antal = 4; // hvor mange pipes du vil have synlige
  const start = W() / 2;
  const afstand = PIPE_SPEED * SPAWN_EVERY;
  for (let i = 0; i < antal; i++) {
    const x = start + afstand * i;
    spawnPipe(false); // opret pipe som normalt
    pipes[pipes.length - 1].x = x; // flyt pipe til ønsket position
  }
}

// --- Loop --------------------------------------------------------------------
let last = performance.now();
requestAnimationFrame(function raf(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  if (gameState === "playing") {
    // Fysik
    fish.vy += GRAVITY * dt;
    fish.y += fish.vy * dt;
    fish.rot = Math.atan2(fish.vy, 400);

    // Spawn/flyt forhindringer
    timeSinceSpawn += dt;
    if (timeSinceSpawn >= SPAWN_EVERY) {
      timeSinceSpawn = 0;
      spawnPipe();
    }
    for (const p of pipes) {
      p.x -= PIPE_SPEED * dt;
      if (!p.passed && p.x + PIPE_W < fish.x) {
        p.passed = true;
        score++;
        best = Math.max(best, score);
      }
    }
    pipes = pipes.filter((p) => p.x + PIPE_W > -6);

    // Kollision (med “loft/gulv” og forhindringer)
    if (fish.y - FISH_H / 2 < 0 || fish.y + FISH_H / 2 > H() - SEA_FLOOR_H) {
      gameState = "gameover";
    }
    // brug fiskens omkreds som rektangel for simpel kollision
    const fx = fish.x - FISH_W / 2,
      fy = fish.y - FISH_H / 2;
    for (const p of pipes) {
      const hitTop = rectsOverlap(
        fx,
        fy,
        FISH_W,
        FISH_H,
        p.x,
        p.top.y,
        PIPE_W,
        p.top.h
      );
      const hitBot = rectsOverlap(
        fx,
        fy,
        FISH_W,
        FISH_H,
        p.x,
        p.bottom.y,
        PIPE_W,
        p.bottom.h
      );
      if (hitTop || hitBot) {
        gameState = "gameover";
        break;
      }
    }
  }

  draw();
  requestAnimationFrame(raf);
});

// --- Tegn --------------------------------------------------------------------
function draw() {
  // canvas er transparent – vi rydder bare
  ctx.clearRect(0, 0, W(), H());

  drawPipes();
  drawFish();
  drawHUD();
}

function drawPipes() {
  for (const p of pipes) {
    // top (vi strækker PNG’en til rørlængden)
    if (assets.top.complete) {
      drawTiledOrStretched(assets.top, p.x, p.top.y, PIPE_W, p.top.h);
    } else {
      // fallback rektangel
      ctx.fillStyle = "#ff6b8a";
      ctx.fillRect(p.x, p.top.y, PIPE_W, p.top.h);
    }

    // bottom
    if (assets.bottom.complete) {
      drawTiledOrStretched(assets.bottom, p.x, p.bottom.y, PIPE_W, p.bottom.h);
    } else {
      ctx.fillStyle = "#ff6b8a";
      ctx.fillRect(p.x, p.bottom.y, PIPE_W, p.bottom.h);
    }
  }
}

// Stræk PNG'en i højden uden at se alt for mærkeligt ud
function drawTiledOrStretched(img, x, y, w, h) {
  // simpelt: bare stræk – ser fint ud for “koraller”
  ctx.drawImage(img, x, y, w, h);
}

function drawFish() {
  ctx.save();
  ctx.translate(fish.x, fish.y);
  ctx.rotate(fish.rot * 0.6);

  if (assets.fish.complete) {
    ctx.drawImage(assets.fish, -FISH_W / 2, -FISH_H / 2, FISH_W, FISH_H);
  } else {
    // fallback (hvis fish.png ikke nåede at loade)
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(-FISH_W / 2, -FISH_H / 2, FISH_W, FISH_H);
  }
  ctx.restore();
}


// --- Score board + beskeder --------------------------------------------------------------------
function drawHUD() {
  // Score
  ctx.fillStyle = "rgba(0,0,0,.35)"; // baggrund
  drawRoundedRect(ctx, 40, 50, 160, 70, 24); // 24px radius
  ctx.fillStyle = "#fff"; // tekstfarve
  ctx.font = "bold 22px 'DynaPuff', cursive";
  ctx.fillText(`Point    ${score}`, 60, 80);
  ctx.font = "bold 16px 'DynaPuff', cursive";
  ctx.fillText(`Rekord   ${best}`, 60, 104);

  // Tilstandstekster
  if (gameState === "ready") {
    centerText("Tryk/Space for at svømme");
  } else if (gameState === "paused") {
    centerText("Pause — tryk p for at fortsætte");
  } else if (gameState === "gameover") {
    centerText("Game Over\ntryk for at svømme igen");
    updateTrykHerBtn();
  }
}

function centerText(text) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,.35)"; // baggrund
  const w = Math.min(600, W() - 40), h = 150; // evt. større højde
  const x = (W() - w) / 2, y = (H() - h) / 2;
  drawRoundedRect(ctx, x, y, w, h, 24); // 24px radius
  ctx.fillStyle = "#fff";
  ctx.font = "bold 40px 'DynaPuff', cursive";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
   // Del tekst op i linjer ved \n
   const lines = text.split('\n');
   const startY = H() / 2 + 6 - ((lines.length - 1) * 32) / 2;
   lines.forEach((line, i) => {
     ctx.fillText(line, W() / 2, startY + i * 32);
   });
  ctx.restore();
}


// --- Hjælpe funktioner --------------------------------------------------------------------
// Hjælpefunktion til afrundede rektangler
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

