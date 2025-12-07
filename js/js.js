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

