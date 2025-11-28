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

// ======== VENDESPIL ========

// Dynamisk opbygning af vendespilsbrikker fra JSON

const vendespilsbrikker = document.querySelector("#vendespilsbrikker");
if (vendespilsbrikker) {
  // Bland et array tilfældigt (Fisher-Yates)
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Hent kun de fisk fra JSON, der skal bruges til vendespil
  function vendespilFisk() {
    return allFish.filter((fisk) => fisk.vendespil);
  }

  let brikker = []; // Array med alle brikker til vendespil

  // # Opbyg brikker-array ud fra fiskene
  function opbygBrikker() {
    brikker = [];
    vendespilFisk().forEach((fisk) => {
      // Tilføj to brikker af hver fisk (for at kunne matche)
      brikker.push({
        id: fisk.id,
        forside: fisk.card.forside,
        bagside: fisk.card.bagside,
      });
      brikker.push({
        id: fisk.id,
        forside: fisk.card.forside,
        bagside: fisk.card.bagside,
      });
    });
    brikker = shuffle(brikker); // Bland brikkerne
  }

  // Opbygning af silhuetterne til score-området
  function visSkygger() {
    const scoreShadowArea = document.getElementById("scoreShadowArea");

    scoreShadowArea.innerHTML = "";

    vendespilFisk().forEach((fisk) => {
      const img = document.createElement("img");

      img.src = fisk.imageShadow; // billede af skygge/silhuet
      img.dataset.id = fisk.id;
      img.classList.add("score-shadow");

      scoreShadowArea.appendChild(img);
    });
  }

  // Udfyld skygge i score-området når et match er fundet
  function udfyldSkygge(fish) {
    const shadow = document.querySelector(
      `.score-shadow[data-id="${fish.id}"]`
    );

    if (shadow) {
      shadow.src = fish.image; // detaljeret fiske-version
      shadow.classList.add("filled");
    }
  }

  // # Byg HTML for alle brikker og vis dem på siden
  function visBrikker() {
    vendespilsbrikker.innerHTML = "";
    for (let i = 0; i < brikker.length; i++) {
      vendespilsbrikker.innerHTML += `
        <div class="brik" data-id="${brikker[i].id}">
          <div class="kort">
            <img src="${brikker[i].bagside}" alt="bagside" class="bagside">
            <img src="${brikker[i].forside}" alt="brik ${brikker[i].id}" class="forside">
          </div>
        </div>
      `;
    }
  }

  // Kald opbygning og visning når fiskene er hentet
  window.addEventListener("load", () => {
    setTimeout(() => {
      opbygBrikker();
      visBrikker();
      visSkygger();
      // Sørg for at endGameDialog er skjult fra start
      const endGameDialog = document.getElementById("endGameDialog");
      if (endGameDialog && endGameDialog.open) {
        endGameDialog.close();
      }
    }, 600);
  });

  const FLIP_MS = 500; // matcher CSS transition

  // Klik: vend brikker og tjek for match (2 ad gangen)

  let åben = []; // holder de åbne brikker (DOM-elementer)
  let låst = false; // lås input mens vi tjekker
  let spilErFærdigt = false; // flag for om spillet er færdigt

  vendespilsbrikker.addEventListener("click", (e) => {
    const brik = e.target.closest(".brik");
    if (!brik || låst) return;

    if (brik.classList.contains("vendt") || brik.classList.contains("fundet"))
      return;

    brik.classList.add("vendt");
    åben.push(brik);

    if (åben.length === 2) {
      låst = true;
      const [a, b] = åben;
      const match = a.dataset.id === b.dataset.id;

      // Når et match er fundet
      setTimeout(() => {
        if (match) {
          a.classList.add("fundet");
          b.classList.add("fundet");

          // Hent data om fisken
          const fish = allFish.find((f) => f.id == a.dataset.id);

          // Vis dialog
          showMatchDialog(fish);

          // Udfyld skygger af fisk i score-området
          udfyldSkygge(fish);

          // Skjul brikkerne
          setTimeout(() => {
            a.style.visibility = "hidden";
            b.style.visibility = "hidden";

            // Tjek om alle brikker er fundet/skjult
            const alleBrikker = document.querySelectorAll(".brik");
            const alleSkjult = Array.from(alleBrikker).every(
              (brik) => brik.style.visibility === "hidden"
            );
            if (alleSkjult) {
              spilErFærdigt = true;
            }
          }, FLIP_MS);
        } else {
          a.classList.remove("vendt");
          b.classList.remove("vendt");
        }
        åben = [];
        låst = false;
      }, FLIP_MS); // vent til flip er færdig
    }
  });

  // DIALOG NÅR MACHT ER FUNDET
  function showMatchDialog(cardData) {
    document.getElementById("matchName").innerText = cardData.name;
    document.getElementById("dialogImage").src = cardData.image;
    document.getElementById("matchDialog").showModal();
  }

  // Luk dialog når man klikker på OK-knappen
  document.getElementById("closeDialogBtn").addEventListener("click", () => {
    document.getElementById("matchDialog").close();
    if (spilErFærdigt) {
      // Kald endGame først efter matchDialog er lukket
      setTimeout(() => {
        endGame();
      }, 100);
    }
  });

  // Luk dialog hvis man klikker udenfor dialogen (kun én gang)
  document.addEventListener("DOMContentLoaded", function () {
    const matchDialog = document.getElementById("matchDialog");
    if (matchDialog) {
      matchDialog.addEventListener("click", function (e) {
        if (e.target === matchDialog) {
          matchDialog.close();
        }
      });
    }
  });
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
