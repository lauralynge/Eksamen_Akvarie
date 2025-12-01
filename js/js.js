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

// ======== INAKTIVITETS TIMER ========
// Kun aktiv på index.html
if (window.location.pathname.includes("index.html")) {
  const inactivityTime = 5000; // fx 5 sekunder
  let inactivityTimer;
  function startInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      console.log("Inaktivitet: redirect til index.html");
      window.location.replace("index.html"); // redirect til forsiden
    }, inactivityTime);
  }
  ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(evt => {
    document.addEventListener(evt, startInactivityTimer);
  });
  startInactivityTimer();
}



