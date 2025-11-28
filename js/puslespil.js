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

// ======== PUSLESPIL ========

const puzzle = document.getElementById("puzzle");
const pieceContainerLeft = document.getElementById("piece-container-left");
const pieceContainerRight = document.getElementById("piece-container-right");
const statusText = document.getElementById("status");

if (puzzle && pieceContainerLeft && pieceContainerRight && statusText) {
  // Opret brikkerne med korrekt udsnit
  const pieceSize = 200; // px
  const puzzleSize = 3; // 3x3 grid
  const pieces = [];
  for (let i = 0; i < 9; i++) {
    const div = document.createElement("div");
    div.classList.add("piece");
    div.setAttribute("draggable", "true");

    // Beregn korrekt position
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
    div.dataset.index = i; // startposition
    pieces.push(div);
  }

  // Bland brikkerne og fordel dem i to containere med 4 i hver
  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach((p, idx) => {
    if (idx < 4) {
      pieceContainerLeft.appendChild(p);
    } else if (idx < 8) {
      pieceContainerRight.appendChild(p);
    } else {
      (Math.random() < 0.5
        ? pieceContainerLeft
        : pieceContainerRight
      ).appendChild(p);
    }
  });

  // Opret 9 tomme slots i puslespilsrammen
  puzzle.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const slot = document.createElement("div");
    slot.classList.add("puzzle-slot");
    slot.dataset.slot = i;
    slot.style.width = pieceSize + "px";
    slot.style.height = pieceSize + "px";
    slot.style.position = "relative";
    puzzle.appendChild(slot);
  }

  let dragging = null;
  let dragOrigin = null;

  // Drag start
  document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("piece")) {
      dragging = e.target;
      dragOrigin = e.target.parentElement;
      e.target.classList.add("dragging");
    }
  });

  // Drag end
  document.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("piece")) {
      e.target.classList.remove("dragging");
    }
  });

  // Drag over på puzzle-området og begge containere
  puzzle.addEventListener("dragover", (e) => e.preventDefault());
  document.querySelectorAll(".puzzle-slot").forEach((slot) => {
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!dragging) return;
      // Kun tillad drop hvis slot er tom
      if (!slot.querySelector(".piece")) {
        // Tjek om brikken droppes på korrekt plads
        if (dragging.dataset.correct == slot.dataset.slot) {
          slot.appendChild(dragging);
          dragging.setAttribute("data-slot", slot.dataset.slot);
          checkSolved();
        } else {
          // Forkert plads: flyt tilbage til oprindelig container
          if (dragOrigin === pieceContainerLeft) {
            pieceContainerLeft.appendChild(dragging);
          } else {
            pieceContainerRight.appendChild(dragging);
          }
          statusText.textContent = "Prøv igen!";
        }
      }
      dragging = null;
      dragOrigin = null;
    });
  });
  pieceContainerLeft.addEventListener("dragover", (e) => e.preventDefault());
  pieceContainerRight.addEventListener("dragover", (e) => e.preventDefault());

  // Drop på puslespilsrammen
  // puzzle.addEventListener("drop", ...) fjernet, da drop nu håndteres af slots

  // Drop tilbage i venstre container
  pieceContainerLeft.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragging) {
      pieceContainerLeft.appendChild(dragging);
      dragging = null;
      dragOrigin = null;
    }
  });
  // Drop tilbage i højre container
  pieceContainerRight.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragging) {
      pieceContainerRight.appendChild(dragging);
      dragging = null;
      dragOrigin = null;
    }
  });

  // Tjek om puzzle er løst
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
      statusText.textContent = "🎉 Du løste puslespillet!";
      setTimeout(showPuzzleEndDialog, 600); // Vis dialog efter kort pause
    } else {
      statusText.textContent = "";
    }
  }

  // Vis endgame-dialog for puslespil
  function showPuzzleEndDialog() {
    let dialog = document.getElementById("endGameDialog");
    if (!dialog) {
      // Opret dialog dynamisk hvis den ikke findes
      dialog = document.createElement("dialog");
      dialog.id = "endGameDialog";
      document.body.appendChild(dialog);
    }
    dialog.innerHTML = `
      <h1>Sejt! Du løste puslespillet!</h1>
      <div class="puzzle-end-image-row">
        <img src="images/puslespil.jpg" alt="Færdigt puslespil" class="puzzle-end-image" />
      </div>
      <button id="closePuzzleEndGameBtn" class="puzzle-end-btn">Spil igen</button>
    `;
    document.body.classList.add("dialog-open");
    dialog.showModal();
    // Luk dialog og genstart spillet
    const btn = document.getElementById("closePuzzleEndGameBtn");
    if (btn) {
      btn.onclick = () => {
        dialog.close();
        document.body.classList.remove("dialog-open");
        location.reload();
      };
    }
    // Luk dialog hvis man klikker udenfor
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) {
        dialog.close();
        document.body.classList.remove("dialog-open");
        location.reload();
      }
    });
  }
}

// SPIL ER FÆRDIGT
function endGame() {
  // Vis slut-dialog i stedet for alert
  const dialog = document.getElementById("endGameDialog");
  if (dialog) {
    // Fjern score-området
    const scoreShadowArea = document.getElementById("scoreShadowArea");
    if (scoreShadowArea) {
      scoreShadowArea.innerHTML = "";
    }
    // Fyld fish-row med alle fisk
    const fishRow = document.getElementById("endGameFishRow");
    if (fishRow) {
      fishRow.innerHTML = allFish
        .filter((fisk) => fisk.vendespil)
        .map(
          (fisk) =>
            `<img src='${fisk.image}' alt='${fisk.name}' style='height:80px; border-radius:8px;' title='${fisk.name}' />`
        )
        .join("");
    }
    dialog.showModal();
    // Tilføj event listener til start-igen-knap
    const btn = document.getElementById("closeEndGameBtn");
    if (btn) {
      btn.onclick = () => {
        dialog.close();
        location.reload();
      };
    }
  } else {
    // fallback hvis dialog ikke findes
    alert("Sejt! Du fandt alle fiskene. Har du lyst til at spille igen?");
    location.reload();
  }
}
