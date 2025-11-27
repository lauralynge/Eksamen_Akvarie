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
    displayFishCarousel(allFish); // Vis fiskene i karrusellen
  } catch (error) {
    console.error("Fejl ved hentning:", error);
  }
}

// ======== FISKE KARRUSEL ========

// #3: Vis fisk i karrusellen
function displayFishCarousel(fishes) {
  const container = document.getElementById("fiskekarrusel-items");
  if (!container) return; // Stop hvis elementet ikke findes

  // Ryd containerens indhold
  container.innerHTML = "";

  // Opret 'fiskekort' for hver fisk
  fishes.forEach((fish) => {
    const fishCard = document.createElement("div");
    fishCard.className = "fiskekort";
    fishCard.innerHTML = `
        <img src="${fish.image}" alt="${fish.name}" onclick="openModal(${fish.id})">
      `;
    container.appendChild(fishCard);
  });

  // Duplicer indhold for uendelig scroll
  const items = container.innerHTML;
  container.innerHTML = items + items; // Duplicer alt indhold

  // Start i midten af det duplicerede indhold
  setTimeout(() => {
    container.scrollLeft = container.scrollWidth / 4;
  }, 100);
}

// #4: Karrusel navigation - forbedret uendelig scroll
function scrollKarrusel(direction) {
  const container = document.getElementById("fiskekarrusel-items");
  const itemWidth = 240; // Justeret billede bredde + gap
  const scrollAmount = itemWidth * 1; // Scroll 1 billede ad gangen for bedre kontrol

  // Konverter direction string til nummer
  const scrollDirection = direction === "højre" ? 1 : -1;

  /* Normal scroll */
  container.scrollBy({
    left: scrollDirection * scrollAmount,
    behavior: "smooth",
  });

  /* Forbedret uendelig reset */
  setTimeout(() => {
    const maxScroll = container.scrollWidth / 2;
    const currentScroll = container.scrollLeft;

    // Højre reset - når vi når til enden af dupliceret indhold
    if (scrollDirection === 1 && currentScroll >= maxScroll - 50) {
      container.style.scrollBehavior = "auto";
      container.scrollLeft = currentScroll - maxScroll;

      // Kort pause før genaktivering af smooth scroll
      setTimeout(() => {
        container.style.scrollBehavior = "smooth";
      }, 50);
    }
    // Venstre reset - når vi når til starten
    else if (scrollDirection === -1 && currentScroll <= 50) {
      container.style.scrollBehavior = "auto";
      container.scrollLeft = currentScroll + maxScroll;

      // Kort pause før genaktivering af smooth scroll
      setTimeout(() => {
        container.style.scrollBehavior = "smooth";
      }, 50);
    }
  }, 400); // Kortere timeout for hurtigere respons
}

// Håndter mouse scroll for uendelig scroll
function handleMouseScroll() {
  const container = document.getElementById("fiskekarrusel-items");
  const halfWidth = container.scrollWidth / 2;

  if (container.scrollLeft >= halfWidth) {
    // Reset til start uden animation
    container.style.scrollBehavior = "auto";
    container.scrollLeft = container.scrollLeft - halfWidth;
    container.style.scrollBehavior = "smooth";
  } else if (container.scrollLeft <= 0) {
    // Reset til midten uden animation
    container.style.scrollBehavior = "auto";
    container.scrollLeft = halfWidth;
    container.style.scrollBehavior = "smooth";
  }
}

// Initialiser karrusel position og duplicer indhold
document.addEventListener("DOMContentLoaded", function () {
  // Vent på at fiskene er loadet før vi sætter karrusellen op
  setTimeout(() => {
    const container = document.getElementById("fiskekarrusel-items");
    if (container && container.children.length > 0) {
      const items = container.innerHTML;

      // Duplicer alt indhold for uendelig scroll
      container.innerHTML = items + items;

      // Start i midten af det duplicerede indhold
      container.scrollLeft = container.scrollWidth / 4;

      // Tilføj mouse scroll event listener
      container.addEventListener("scroll", handleMouseScroll);
    }
  }, 500); // Vent lidt på at JSON data er loaded
});

// Funktion til hjørne-knappen
function cornerButtonClick() {
  // Tilføj en sjov animation før navigation
  const button = document.querySelector(".corner-button");
  button.style.transform = "scale(1.3) rotate(360deg)";

  // Naviger til fiskhjem.html efter animation
  setTimeout(() => {
    window.location.href = "fiskhjem.html";
  }, 600);
}

// ======== DIALOG FUNKTIONER ========

// #5: Åbn dialog med fisk-information
function openModal(fishId) {
  const dialog = document.getElementById("fish-dialog");
  const content = document.getElementById("dialog-content");

  // Find den specifikke fisk baseret på ID
  const fish = allFish.find((f) => f.id === fishId);

  if (!fish) {
    console.error("Fisk ikke fundet med ID:", fishId);
    return;
  }

  // Opdater dialog indhold med komplet fisk-information            // SKAL RETTES I SÅ KUN RELEVANT INFO VISES
  content.innerHTML = `
    <div class="fish-dialog-container">
      <img src="${fish.image}" alt="${fish.name}" class="fish-dialog-image">

      <h2 class="fish-dialog-title">
        ${fish.name}
      </h2>
      
      <h3 class="fish-dialog-latin">
        ${fish.latinName}
      </h3>
      
      <div class="fish-dialog-info">
        <h4 class="fish-dialog-paragraph">
          <strong>Beskrivelse:</strong><br>
          ${fish.description}
        </h4>
        
        <h4 class="fish-dialog-paragraph">
          <strong>Lever i:</strong><br>
          ${fish.livesIn}
        </h4>
        
        <h4 class="fish-dialog-paragraph">
          <strong>Sjov fakta:</strong><br>
          ${fish.funFact}
        </h4>
        
        <div class="fish-color-tags">
          ${
            Array.isArray(fish.color)
              ? fish.color
                  .map(
                    (color) =>
                      `<span class="fish-dialog-color-tag" data-color="${color}">${color}</span>`
                  )
                  .join("")
              : `<span class="fish-dialog-color-tag" data-color="${fish.color}">${fish.color}</span>`
          }
        </div>
      </div>
    </div>
  `;

  // Åbn dialog
  dialog.showModal();
}

// #6: Luk dialog
function closeModal() {
  const dialog = document.getElementById("fish-dialog");
  dialog.close();
}

// Tilføj event listener til luk-knappen
document.addEventListener("DOMContentLoaded", function () {
  const closeButton = document.getElementById("close-dialog");
  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  // Luk dialog hvis man klikker udenfor
  const dialog = document.getElementById("fish-dialog");
  if (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) {
        closeModal();
      }
    });
  }
});

// ======== VENDESPIL ========

// Dynamisk opbygning af vendespilsbrikker fra JSON

// opbygning og visning af brikker

const vendespilsbrikker = document.querySelector("#vendespilsbrikker"); // Container til alle brikker

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
  }, 600);
});

const FLIP_MS = 500; // matcher CSS transition

// Klik: vend brikker og tjek for match (2 ad gangen)
let åben = []; // holder de åbne brikker (DOM-elementer)
let låst = false; // lås input mens vi tjekker

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

    setTimeout(() => {
      if (match) {
        a.classList.add("fundet");
        b.classList.add("fundet");

        // Hent data om fisken
        const fish = allFish.find((f) => f.id == a.dataset.id);

        // 1. Vis dialog
        showMatchDialog(fish);

        // 2. Tilføj til score
        addToScore(fish);
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

// STIK LIGGES I SCORE-OMRÅDET

function addToScore(cardData) {
  const scoreArea = document.getElementById("scoreArea");
  const img = document.createElement("img");

  img.src = cardData.image;
  img.alt = cardData.name;
  img.classList.add("score-card");

  scoreArea.appendChild(img);
}
