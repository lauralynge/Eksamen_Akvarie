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
  container.innerHTML = items + items;

  // Start i midten af det duplicerede indhold
  const containerParent = document.querySelector(
    "#fiskekarrusel-items"
  ).parentElement;
  if (containerParent) {
    setTimeout(() => {
      container.scrollLeft = container.scrollWidth / 4;
    }, 100);
  }
}

// #4: Karrusel navigation
function scrollKarrusel(direction) {
  const container = document.getElementById("fiskekarrusel-items");
  const itemWidth = 270; // Billede bredde + gap
  const scrollAmount = itemWidth * 2; // Scroller 2 billeder ad gangen
  const halfWidth = container.scrollWidth / 2;

  // Tjek direction string og konverter til nummer
  const scrollDirection = direction === "højre" ? 1 : -1;

  /* Normal scroll */
  container.scrollBy({
    left: scrollDirection * scrollAmount,
    behavior: "smooth",
  });

  /* karrusellen kører uendeligt */
  setTimeout(() => {
    if (scrollDirection === 1 && container.scrollLeft >= halfWidth) {
      // Reset til start uden animation
      container.style.scrollBehavior = "auto";
      container.scrollLeft = container.scrollLeft - halfWidth;
      container.style.scrollBehavior = "smooth";
    } else if (scrollDirection === -1 && container.scrollLeft <= 0) {
      // Reset til midten uden animation
      container.style.scrollBehavior = "auto";
      container.scrollLeft = halfWidth;
      container.style.scrollBehavior = "smooth";
    }
  }, 500);
}

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
          ${Array.isArray(fish.color) 
            ? fish.color.map(color => `<span class="fish-dialog-color-tag" data-color="${color}">${color}</span>`).join('')
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
