"use strict";

let allFish = [];

// Når siden er klar
window.addEventListener("load", () => {
  initPuzzle();
  getFish();
});

// ======== FISK ========
async function getFish() {
  try {
    const response = await fetch("./JSON/fish.json");
    const data = await response.json();
    allFish = data.fish;
    console.log(`📊 JSON data modtaget: ${allFish.length} fisk`);
  } catch (error) {
    console.error("❌ Fejl under hentning af fisk:", error);
  }
}

// Fyld fiskene i slutskærmen
function fillFishRow() {
  const fishRow = document.getElementById("endGameFishRow");
  if (fishRow && allFish.length > 0) {
    fishRow.innerHTML = allFish
      .filter((fisk) => fisk.vendespil)
      .map(
        (fisk) =>
          `<img src='${fisk.image}' alt='${fisk.name}' style='height:80px; border-radius:8px;' title='${fisk.name}' />`
      )
      .join("");
  }
}

// ======== PUSLESPIL ========
function initPuzzle() {
  const puzzle = document.getElementById("puzzle");
  const pieceContainerLeft = document.getElementById("piece-container-left");
  const pieceContainerRight = document.getElementById("piece-container-right");
  const statusText = document.getElementById("status");

  const pieceSize = 200;
  const puzzleSize = 3;
  const pieces = [];

  // Opret brikker
  for (let i = 0; i < 9; i++) {
    const div = document.createElement("div");
    div.classList.add("piece");
    div.setAttribute("draggable", "true");

    const col = i % puzzleSize;
    const row = Math.floor(i / puzzleSize);
    const x = -col * pieceSize;
    const y = -row * pieceSize;

    div.style.width = pieceSize + "px";
    div.style.height = pieceSize + "px";
    div.style.backgroundPosition = `${x}px ${y}px`;
    div.style.backgroundSize = `${pieceSize * puzzleSize}px ${
      pieceSize * puzzleSize
    }px`;

    div.dataset.correct = i;

    // Tilføj hjørne-klasser
    if (row === 0 && col === 0) div.classList.add("corner-top-left");
    if (row === 0 && col === puzzleSize - 1)
      div.classList.add("corner-top-right");
    if (row === puzzleSize - 1 && col === 0)
      div.classList.add("corner-bottom-left");
    if (row === puzzleSize - 1 && col === puzzleSize - 1)
      div.classList.add("corner-bottom-right");

    pieces.push(div);
  }

  // Bland brikkerne
  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach((p, idx) => {
    (idx % 2 === 0 ? pieceContainerLeft : pieceContainerRight).appendChild(p);
  });

  // Opret slots
  puzzle.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const slot = document.createElement("div");
    slot.classList.add("puzzle-slot");
    slot.dataset.slot = i;
    slot.style.width = pieceSize + "px";
    slot.style.height = pieceSize + "px";
    puzzle.appendChild(slot);
  }

  let dragging = null;

  // Drag start
  document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("piece")) {
      dragging = e.target;
      e.target.classList.add("dragging");
    }
  });

  // Drag end
  document.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("piece")) {
      e.target.classList.remove("dragging");
      dragging = null;
    }
  });

  // Drop i slots
  document.querySelectorAll(".puzzle-slot").forEach((slot) => {
    slot.addEventListener("dragover", (e) => e.preventDefault());
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!dragging) return;
      if (slot.querySelector(".piece")) {
        puzzle.appendChild(slot.querySelector(".piece"));
      }
      slot.appendChild(dragging);
      checkSolved();
    });
  });

  // Drop tilbage i containere
  [pieceContainerLeft, pieceContainerRight].forEach((container) => {
    container.addEventListener("dragover", (e) => e.preventDefault());
    container.addEventListener("drop", (e) => {
      e.preventDefault();
      if (dragging) container.appendChild(dragging);
    });
  });

  // Tjek om puslespil er løst
  function checkSolved() {
    let solved = true;
    for (let i = 0; i < 9; i++) {
      const slot = puzzle.querySelector(`.puzzle-slot[data-slot='${i}']`);
      const piece = slot.querySelector(".piece");
      if (!piece || Number(piece.dataset.correct) !== i) {
        solved = false;
        break;
      }
    }
    if (solved) {
      setTimeout(showPuzzleEndDialog, 600);
    }
  }

  function showPuzzleEndDialog() {
    const dialog = document.getElementById("endPuzzleGameDialog");
    document.body.classList.add("dialog-open");
    dialog.showModal();

    // Start-igen-knap
    const btn = document.getElementById("restartPuzzleBtn");
    if (btn) {
      btn.onclick = () => {
        dialog.close();
        document.body.classList.remove("dialog-open");
        // Fjern alle brikker fra slots og containere
        document.querySelectorAll(".piece").forEach((piece) => piece.remove());
        document
          .querySelectorAll(".puzzle-slot")
          .forEach((slot) => (slot.innerHTML = ""));
        // Start puslespillet forfra med nye shuffled brikker
        initPuzzle();
      };
    }
  }
}
