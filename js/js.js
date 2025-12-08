"use strict";

// #0: Lyt efter side indlæsning
window.addEventListener("load", initApp);

let allFish = []; // Globalt array til at holde alle fisk

// #1: Initialiser appen
function initApp() {
  console.log("initApp: app.js kører 🎉");
  getFish(); // Henter fiskene
  getEnvironments(); // Henter miljøerne
  setupBubbleSound(); // Sæt boble-lyd på links
  primeBubbleSound(); // Forudindlæs lyd på første tryk
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

// ======== SETUP BOBLE-LYDEFFEKTER ========
function setupBubbleSound() {
  const links = document.querySelectorAll(".bobble-link");
  const popSound = document.getElementById("popSound");

  if (!popSound) {
    console.warn("Lydfil ikke fundet");
    return;
  }

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // stop normal navigation

      // Afspil lyd
      popSound.currentTime = 0;
      popSound.play().catch(err => console.error("Lyd kunne ikke afspilles:", err));

      const href = link.getAttribute("href");

      // Vent 300 ms så lyden kan høres
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
}

// Prime lyd på første tryk (for at undgå autoplay-blokering)
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
  }, { once: true });
}

// Kald begge funktioner når siden er klar
document.addEventListener("DOMContentLoaded", () => {
  primeBubbleSound();
  setupBubbleSound();
});

// ======== SLUMRE TILSTAND FUNKTIONER INDEX ========

console.log("SCRIPT KØRER");

let awakened = false;
let firstTapDone = false;

const overlay = document.getElementById("sleepOverlay");
const audio = document.getElementById("indexAudio");

function wakeScreen() {
   console.log("wakeScreen kaldt");  // debug
    document.body.classList.add("awake");

    audio.play().catch(() => {});
    awakened = true;
}

// GLOBALT tryk på skærmen
window.addEventListener("click", function () {

    // Første tryk → vækker skærmen
    if (!awakened) {
        wakeScreen();
        return;
    }

    // Andet tryk → gå til næste side
    window.location.href = "intro.html";
});

window.addEventListener("touchstart", function () {

    // Første tryk → vækker skærmen
    if (!awakened) {
        wakeScreen();
        return;
    }

    // Andet tryk → gå til næste side
    window.location.href = "intro.html";
});


// ======== SPEAK INTRO ========
// Hent audio-elementet fra HTML
const introAudio = document.getElementById("introAudio");

// Start lyd når siden loader
window.addEventListener("load", () => {
  introAudio.play().catch(err => {
    console.log("Autoplay blev blokeret, kræver klik:", err);
  });
});

// Stop lyd når man klikker videre
document.getElementById("nextBtn").addEventListener("click", () => {
  introAudio.pause();
  introAudio.currentTime = 0; // nulstil til start
  // evt. naviger til næste side:
  // window.location.href = "nextpage.html";
});

