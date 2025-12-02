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
