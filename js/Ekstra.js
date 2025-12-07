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