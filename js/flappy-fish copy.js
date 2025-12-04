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
  fish: new Image("../images/klovnfisk.png"),
  top: new Image("../images/omvendttangtønde.png"),
  bottom: new Image("../images/tangtønde.png"),
};
assets.fish.src = "images/klovnfisk.png";
assets.top.src = "images/omvendttangtønde.png";
assets.bottom.src = "images/tangtønde.png";

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
const FISH_W = 48,
  FISH_H = 36;
const PIPE_W = 70;
const GAP_MIN = 150,
  GAP_MAX = 190;
const PIPE_SPEED = 220; // px/s
const SPAWN_EVERY = 1.4; // s
const SEA_FLOOR_H = 40; // usynlig bund-kollision

// --- Spil-tilstand -----------------------------------------------------------
let gameState = "ready"; // 'ready' | 'playing' | 'paused' | 'gameover'
let fish,
  pipes,
  score,
  best = 0,
  timeSinceSpawn = 0;

// Start/Reset
function resetGame() {
  fish = { x: W() * 0.28, y: H() * 0.45, vy: 0, rot: 0 };
  pipes = [];
  score = 0;
  timeSinceSpawn = 0;
  gameState = "ready";
}
resetGame();

// --- Input -------------------------------------------------------------------
function flap() {
  if (gameState === "ready") gameState = "playing";
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

function spawnPipe() {
  const gap = rand(GAP_MIN, GAP_MAX);
  const topH = rand(40, H() - SEA_FLOOR_H - 40 - gap);
  const bottomY = topH + gap;
  const x = W() + PIPE_W;
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

function drawHUD() {
  // Score
  ctx.fillStyle = "rgba(0,0,0,.35)";
  ctx.fillRect(10, 10, 120, 54);
  ctx.fillStyle = "#fff";
  ctx.font = "700 18px system-ui, sans-serif";
  ctx.fillText(`Point: ${score}`, 18, 36);
  ctx.font = "600 12px system-ui, sans-serif";
  ctx.fillText(`Bedst: ${best}`, 18, 52);

  // Tilstandstekster
  if (gameState === "ready") {
    centerText("Klik/Space for at svømme");
  } else if (gameState === "paused") {
    centerText("Pause — tryk P for at fortsætte");
  } else if (gameState === "gameover") {
    centerText("Game Over — tryk R for at starte igen");
  }
}

function centerText(text) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,.55)";
  const w = Math.min(520, W() - 40),
    h = 64;
  ctx.fillRect((W() - w) / 2, (H() - h) / 2 - 24, w, h);
  ctx.fillStyle = "#fff";
  ctx.font = "700 18px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, W() / 2, H() / 2 + 6);
  ctx.restore();
}
