"use strict";

// #0: Lyt efter side indlæsning
window.addEventListener("load", initApp);

let allFish = []; // Globalt array til at holde alle fisk

// #1: Initialiser appen
function initApp() {
  console.log("initApp: app.js kører 🎉");
  getFish(); // Henter fiskene
}

let fishData;
const fishCanvas = document.getElementById("paintLayer");
const ctx = fishCanvas.getContext("2d");
fishCanvas.width = 500;
fishCanvas.height = 400;

const speakLine = document.getElementById("speakLine");
const fishOutline = document.getElementById("fishOutline");

// -------- LOAD JSON --------
fetch("example_fish.json")
  .then((res) => res.json())
  .then((data) => {
    fishData = data;
    setupGame();
  });

function setupGame() {
  document.getElementById("fishName").textContent = fishData.name;
  fishOutline.src = fishData.imageOutline;

  // Lav farve-palette
  const palette = document.getElementById("palette");
  palette.innerHTML = "";
  fishData.colorOptions.forEach((col) => {
    const dot = document.createElement("div");
    dot.classList.add("colorDot");
    dot.style.background = col;
    dot.setAttribute("draggable", "true");
    dot.dataset.color = col;
    palette.appendChild(dot);
  });

  // Drag behavior
  document.querySelectorAll(".colorDot").forEach((dot) => {
    dot.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("color", e.target.dataset.color);
    });
  });

  fishCanvas.addEventListener("dragover", (e) => e.preventDefault());
  fishCanvas.addEventListener("drop", colorTheFish);
}

function colorTheFish(e) {
  const color = e.dataTransfer.getData("color");

  // Simpel farvelægning: cirkel hvor man droppede farven
  const rect = fishCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 35, 0, Math.PI * 2);
  ctx.fill();

  // Print børne-venlig tekst
  speakLine.textContent = fishData.funLines[color] || "Flot farve!";

  // Gem farvelægning i JSON-agtigt objekt
  if (!fishData.coloredParts[color]) {
    fishData.coloredParts[color] = 0;
  }
  fishData.coloredParts[color]++;
}
