"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const PUZZLE_SIZE = 3;
  const PIECE_SIZE = getPieceSize(); // <-- Bruger CSS-variabel
  const TOTAL = PUZZLE_SIZE * PUZZLE_SIZE;

  const puzzle = document.getElementById("puzzle");
  const left = document.getElementById("piece-container-left");
  const right = document.getElementById("piece-container-right");
  const status = document.getElementById("status");

  initPuzzle();

  // --------------------------
  //   Opret nyt puslespil
  // --------------------------
  function initPuzzle() {
    puzzle.innerHTML = "";
    left.innerHTML = "";
    right.innerHTML = "";
    status.textContent = "";

    const pieces = createPieces();
    shuffle(pieces);

    pieces.forEach((p, i) => {
      if (i < 4) left.appendChild(p);
      else if (i < 8) right.appendChild(p);
      else (Math.random() < 0.5 ? left : right).appendChild(p);
    });

    createSlots();
    initDragDrop();
  }

  // --------------------------
  //   Opret brikker
  // --------------------------

  function getPieceSize() {
  return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--piece-size')); // Henter værdi fra CSS-variabel
}

  function createPieces() {
    const arr = [];

    for (let i = 0; i < TOTAL; i++) {
      const div = document.createElement("div");
      div.className = "piece";
      div.draggable = true;
      div.dataset.correct = i;

      const col = i % PUZZLE_SIZE;
      const row = Math.floor(i / PUZZLE_SIZE);

      div.style.backgroundPosition = `-${col * PIECE_SIZE}px -${row * PIECE_SIZE}px`;

      // HJØRNEBRIKKER
      if (i === 0) div.classList.add("corner-top-left");
      if (i === 2) div.classList.add("corner-top-right");
      if (i === 6) div.classList.add("corner-bottom-left");
      if (i === 8) div.classList.add("corner-bottom-right");

      arr.push(div);
    }

    return arr;
  }

  // --------------------------
  //   Opret rammen (slots)
  // --------------------------
  function createSlots() {
    for (let i = 0; i < TOTAL; i++) {
      const slot = document.createElement("div");
      slot.className = "puzzle-slot";
      slot.dataset.slot = i;
      puzzle.appendChild(slot);
    }
  }

  // --------------------------
  //   Drag & drop
  // --------------------------
  function initDragDrop() {
    let dragged = null;
    let origin = null;

    document.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("piece")) {
        dragged = e.target;
        origin = e.target.parentElement;
        dragged.classList.add("dragging");
      }
    });

    document.addEventListener("dragend", (e) => {
      if (e.target.classList.contains("piece")) {
        e.target.classList.remove("dragging");
      }
    });

    [...document.querySelectorAll(".puzzle-slot"), left, right].forEach(
      (el) => {
        el.addEventListener("dragover", (e) => e.preventDefault());
        el.addEventListener("drop", (e) => handleDrop(e, el));
        el.addEventListener("dragenter", (e) => {
          if (el.classList.contains("puzzle-slot")) {
            el.classList.add("drag-over");
          }
        });
        el.addEventListener("dragleave", (e) => {
          el.classList.remove("drag-over");
        });
      }
    );

    function handleDrop(e, target) {
      e.preventDefault();

      if (!dragged) return;

      target.classList.remove("drag-over");

      // drop i et slot
      if (target.classList.contains("puzzle-slot")) {
        if (!target.querySelector(".piece")) {
          target.appendChild(dragged);

          // snap animation
          dragged.classList.add("snap");
          setTimeout(() => dragged.classList.remove("snap"), 300);

          // hvis korrekt
          if (dragged.dataset.correct === target.dataset.slot) {
            dragged.classList.add("correct");
            checkSolved();
          } else {
            dragged.classList.remove("correct");
          }
        } else {
          origin.appendChild(dragged);
        }
      } else {
        // drop i side-containere
        target.appendChild(dragged);
        dragged.classList.remove("correct");
      }

      dragged = null;
    }
  }

  // --------------------------
  //   Tjek om spillet er løst
  // --------------------------
  function checkSolved() {
    for (let i = 0; i < TOTAL; i++) {
      const slot = puzzle.querySelector(`[data-slot="${i}"]`);
      const piece = slot.querySelector(".piece");

      if (!piece || piece.dataset.correct != i) return;
    }

    showWin();
  }

  // --------------------------
  //   Vis vinder-dialog
  // --------------------------
  function showWin() {
    const dialog = document.getElementById("endPuzzleGameDialog");
    const btn = document.getElementById("restartPuzzleBtn");

    document.body.classList.add("dialog-open");
    dialog.showModal();

    btn.onclick = () => {
      dialog.close();
      document.body.classList.remove("dialog-open");
      initPuzzle();
    };
  }

  // --------------------------
  //   Bland brikker
  // --------------------------
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
});
