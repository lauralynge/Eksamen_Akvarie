// ======== SCROLL FUNKTIONER ========

// Scroll ned til bund
document.getElementById("scrollDownButton").addEventListener("click", function () {
  document.getElementById("bottom-section").scrollIntoView({
    behavior: "smooth",
  });
});

// Scroll op til top
document.getElementById("scrollUpButton").addEventListener("click", function () {
    document.body.scrollIntoView({
      behavior: "smooth",
    });
  });

// Skift body class for pil-visning
window.addEventListener("scroll", function () {
  const bund = document.getElementById("bottom-section");
  if (window.scrollY + window.innerHeight > bund.offsetTop + 100) {
    document.body.classList.add("scrolled");
  } else {
    document.body.classList.remove("scrolled");
  }
});

// Endnu mere scroll
const bund = document.getElementById("bottom-section");
const downBtn = document.getElementById("scrollButton");

downBtn.addEventListener("click", () => {
  bund.scrollIntoView({ behavior: "smooth" });
  document.body.classList.add("scrolled");
});



  // Vis kun top-sektion fra start
  document.addEventListener('DOMContentLoaded', function() {
    const topSection = document.querySelector('.top-section');
    const bottomSection = document.querySelector('.bottom-section');
    if (topSection && bottomSection) {
      topSection.style.display = 'block';
      bottomSection.style.display = 'none';
    }
    // Pil ned: vis bund, skjul top
    const scrollBtn = document.getElementById('scrollButton');
    if (scrollBtn) {
      scrollBtn.addEventListener('click', function() {
        topSection.style.display = 'none';
        bottomSection.style.display = 'block';
      });
    }
    // Pil op: vis top, skjul bund
    const scrollUpBtn = document.getElementById('scrollUpButton');
    if (scrollUpBtn) {
      scrollUpBtn.addEventListener('click', function() {
        bottomSection.style.display = 'none';
        topSection.style.display = 'block';
      });
    }
  });



  // ======== INAKTIVITETS TIMER ========   VIRKER IKKE OPTIMALT
//  Hopper automatisk til index.html efter 60 sekunders

const INACTIVITY_LIMIT = 60 * 1000; // 60 sekunder
let inactivityTimer;

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    window.location.href = "index.html"; // hop tilbage til forsiden
  }, INACTIVITY_LIMIT);
}

function setupInactivityTimer() {
  // Reset timer ved ALLE aktiviteter
  const activityEvents = [
    "mousedown",
    "mousemove",
    "keydown",
    "touchstart",
    "scroll",
  ];

  activityEvents.forEach((evt) => {
    document.addEventListener(evt, resetInactivityTimer);
  });

  // Start timer første gang
  resetInactivityTimer();
}

// Start når siden er klar
window.addEventListener("load", setupInactivityTimer);






// ======== SCROLL FUNKTIONER ========

// Scroll ned til bund
document.getElementById("scrollDownButton").addEventListener("click", function () {
  document.getElementById("bottom").scrollIntoView({
    behavior: "smooth",
  });
  this.style.display = "none"; // Skjul ned-knappen
  document.getElementById("scrollUpButton").style.display = "block"; // Vis op-knappen igen
});

// Scroll op til top
document.getElementById("scrollUpButton").addEventListener("click", function () {
  document.getElementById("top").scrollIntoView({
    behavior: "smooth",
  });
  this.style.display = "none"; // Skjul op-knappen
  document.getElementById("scrollDownButton").style.display = "block"; // Vis ned-knappen igen
});





"use strict";

// #0: Lyt efter side indlæsning
window.addEventListener("load", initApp);

let allFish = []; // Globalt array til at holde alle fisk

// #1: Initialiser appen
function initApp() {
  console.log("initApp: app.js kører 🎉");
  getFish(); // Henter fiskene
  getEnvironments(); // Henter miljøerne
  setupBubbleSound(); // 
  primeBubbleSound(); // 
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

// #3: Hent miljøer fra JSON og vis dem
async function getEnvironments() {
  console.log("🌐 Henter alle miljøer fra JSON...");
  try {
    const response = await fetch("./JSON/enviroment.json");
    const data = await response.json();

    allEnvironments = data.Environments; // Hent miljø-arrayet fra JSON
    console.log(`📊 JSON data modtaget: ${allEnvironments.length} miljøer`);
    displayEnvironmentCarousel(allEnvironments); // Vis miljøerne i karrusellen
  } catch (error) {
    console.error("Fejl ved hentning:", error);
  }
}

// Setup boble-lyde
function setupBubbleSound() {
  const links = document.querySelectorAll(".bobble-link");
  const popSound = document.getElementById("popSound");

  if (!popSound) {
    console.warn("Lydfil ikke fundet");
    return;
  }

  links.forEach(link => {
    link.addEventListener("pointerdown", (e) => {
      // Afspil lyd
      popSound.currentTime = 0;
      popSound.play().catch(err => console.error("Lyd kunne ikke afspilles:", err));

      // Stop browseren fra at hoppe med det samme
      e.preventDefault();
      const href = link.getAttribute("href");

      // Vent fx 200 ms og hop så videre
      setTimeout(() => {
        window.location.href = href;
      }, 200);
    });
  });
}

function primeBubbleSound() {
  const popSound = document.getElementById("popSound");
  if (!popSound) return;

  document.body.addEventListener("pointerdown", () => {
  popSound.play().then(() => {
    popSound.pause();
    popSound.currentTime = 0;
    console.log("Pop-lyd er forudindlæst ✅");
  }).catch(() => {
    console.warn("Kunne ikke forudindlæse automatisk (browser blokerer autoplay)");
  });
  }, { once: true }); // sker kun første gang man trykker
}

// #5: Midlertidige placeholders
function displayFishCarousel(fishArray) {
  console.log("displayFishCarousel er ikke implementeret endnu.");
}

function displayEnvironmentCarousel(envArray) {
  console.log("displayEnvironmentCarousel er ikke implementeret endnu.");
}


// ===================================================================
// LÆR-OM-OS (Gammel kode) har ryddet op - skal det ikkr bare slettes? 
// ===================================================================


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
      <h2 class="fish-dialog-title">${fish.name}</h2>
      <h3 class="fish-dialog-latin">${fish.latinName}</h3>
      <div class="fish-dialog-info">
      <h4 class="fish-dialog-paragraph"><strong>Beskrivelse:</strong><br>${fish.description}</h4>
        <h4 class="fish-dialog-paragraph"><strong>Lever i:</strong><br>${fish.livesIn}</h4>
        <h4 class="fish-dialog-paragraph"><strong>Sjov fakta:</strong><br>${fish.funFact}</h4>
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

// ======== LÆR-OM-OS SCROLL FUNKTIONALITET ========

const scrollDownBtn = document.getElementById("scrollDownButton");
const scrollUpBtn = document.getElementById("scrollUpButton");
const img = document.getElementById("laer-om-os-img");

if (scrollDownBtn && scrollUpBtn && img) {
  scrollDownBtn.addEventListener("click", () => {
    document.getElementById("bottom").scrollIntoView({ behavior: "smooth" });
    img.classList.remove("laer-om-os-img-top");
    img.classList.add("laer-om-os-img-bottom");

    scrollDownBtn.style.display = "none";   // skjul ned-knap
    scrollUpBtn.style.display = "block";    // vis op-knap
  });

  scrollUpBtn.addEventListener("click", () => {
    document.getElementById("top").scrollIntoView({ behavior: "smooth" });
    img.classList.remove("laer-om-os-img-bottom");
    img.classList.add("laer-om-os-img-top");

    scrollUpBtn.style.display = "none";     // skjul op-knap
    scrollDownBtn.style.display = "block";  // vis ned-knap
  });
}



// ====== BOBLE LYD FUNKTIONER ======


// Setup boble-lyde
function setupBubbleSound() {
  const links = document.querySelectorAll(".bobble-link");
  const popSound = document.getElementById("popSound");

  if (!popSound) {
    console.warn("Lydfil ikke fundet");
    return;
  }

  links.forEach(link => {
    link.addEventListener("pointerdown", (e) => {
      // Afspil lyd
      popSound.currentTime = 0;
      popSound.play().catch(err => console.error("Lyd kunne ikke afspilles:", err));

      // Stop browseren fra at hoppe med det samme
      e.preventDefault();
      const href = link.getAttribute("href");

      // Vent fx 200 ms og hop så videre
      setTimeout(() => {
        window.location.href = href;
      }, 200);
    });
  });
}

// #5: Prime lyd på første tryk
function primeBubbleSound() {
  const popSound = document.getElementById("popSound");
  if (!popSound) return;

   // Første gang man trykker på skærmen, primes lyden
  document.body.addEventListener("pointerdown", () => {
  popSound.play().then(() => {
    popSound.pause();
    popSound.currentTime = 0;
    console.log("Pop-lyd er forudindlæst ✅");
  }).catch(() => {
    console.warn("Kunne ikke forudindlæse automatisk (browser blokerer autoplay)");
  });
  }, { once: true }); // sker kun første gang man trykker
}