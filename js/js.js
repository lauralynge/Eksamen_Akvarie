"use strict";

// #0: Lyt efter side indlæsning
window.addEventListener("load", initApp);

let allFish = []; // Globalt array til at holde alle fisk
let allEnvironments = []; // Globalt array til at holde alle miljøer

// #1: Initialiser appen
function initApp() {
  console.log("initApp: app.js kører 🎉");
  getFish(); // Henter fiskene
  getEnvironments(); // Henter miljøerne
  setupBubbleSound(); // Sæt boble-lyd på links
  primeBubbleSound(); // Forudindlæs lyd på første tryk

  // Kun kør boble-lyd hvis elementet findes
  if (document.getElementById("popSound")) {
    setupBubbleSound();
    primeBubbleSound();
  }
}

// #2: Hent fisk fra JSON og vis dem
async function getFish() {
  console.log("🌐 Henter alle fisk fra JSON...");
  try {
    const response = await fetch("./JSON/fish.json");
    const data = await response.json();

    allFish = data.fish; // Hent fisk-arrayet fra JSON
    console.log(`📊 JSON data modtaget: ${allFish.length} fisk`);

    // Kun kald displayFishCarousel hvis funktionen findes
    if (typeof displayFishCarousel === "function") {
      displayFishCarousel(allFish); //Vis fiskene i karrusellen
    }
  } catch (error) {
    console.error("Fejl ved hentning:", error);
  }
}

// #3: Hent miljøer fra JSON og vis dem
async function getEnvironments() {
  console.log("🌐 Henter alle miljøer fra JSON...");
  try {
    const response = await fetch("./JSON/environment.json");
    const data = await response.json();

    allEnvironments = data.Environment; // Hent miljø-arrayet fra JSON
    console.log(`📊 JSON data modtaget: ${allEnvironments.length} miljøer`);
    if (typeof displayEnvironment === "function") {
      displayEnvironment(allEnvironments); //Vis miljøerne i karrusellen
    }
  } catch (error) {
    console.error("Fejl ved hentning:", error);
  }
}

// ======== SETUP BOBLE-LYDEFFEKTER ========
function setupBubbleSound() {
   console.log("setupBubbleSound kaldes"); // 👈 Debug-log

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

// ======== SLUMRE TILSTAND FUNKTIONER INDEX ========

console.log("SCRIPT KØRER");

let awakened = false;

const overlay = document.getElementById("sleepOverlay");
const audio = document.getElementById("indexAudio");

function wakeScreen() {
   console.log("wakeScreen kaldt");  // debug
    document.body.classList.add("awake");

    if (audio) { 
        audio.play().catch(() => {}); // kun på sider hvor indexAudio findes
    }
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
if (introAudio) {
window.addEventListener("load", () => {
  introAudio.play().catch(err => {
    console.log("Autoplay blev blokeret, kræver klik:", err);
  });
});

// Stop lyd når man klikker videre
const nextBtn = document.getElementById("nextBtn");
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    introAudio.pause();
    introAudio.currentTime = 0; // nulstil til start
  });
}
}

// ======== SPEAK SPIL-MED-OS ========
// Hent audio-elementet fra HTML
const spilAudio = document.getElementById("spilAudio");

// Start lyd når siden loader
if (spilAudio) {
window.addEventListener("load", () => {
  spilAudio.play().catch(err => {
    console.log("Autoplay blev blokeret, kræver klik:", err);
  });
});

// Stop lyd når man klikker videre
const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      spilAudio.pause();
      spilAudio.currentTime = 0; // nulstil til start
});
  }
}