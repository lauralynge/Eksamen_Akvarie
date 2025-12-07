
// ======== SCROLL KNAPPER FUNKTIONER =======

// Lineær easing-funktion
function linear(t) { return t; }

// Smooth scroll funktion
function smoothScrollTo(targetY, duration = 800) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function scrollStep(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
  const ease = linear(progress);   // Lineær easing for helt jævn scroll
    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  requestAnimationFrame(scrollStep);
}

// Brug sådan her ved scroll til bund:
document.getElementById("scrollDownButton").addEventListener("click", function () {
  const bottom = document.getElementById("bund");
  smoothScrollTo(bottom.offsetTop);
});

// Brug sådan her ved scroll til toppen:
document.getElementById("scrollUpButton").addEventListener("click", function () {
  const top = document.getElementById("top");
  smoothScrollTo(top.offsetTop);
});



// ======== FISKE KARRUSEL ========

// Vis fisk i karrusellen
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






// ======== DIALOG FUNKTIONER FISKEKARRUSEL ========

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
    <div class="fish-dialog-columns">
      <div class="fish-dialog-left">
        <img src="${fish.image}" alt="${fish.name}" class="fish-dialog-image">
        <h2 class="fish-dialog-title">${fish.name}</h2>
        <h3 class="fish-dialog-nickname">${fish.nickname || ''}</h3>
      </div>
  <div class="fish-dialog-right">
        <div class="fish-dialog-info">
          <h4 class="fish-dialog-paragraph"><strong>Beskrivelse:</strong><br>${fish.description}</h4>
          <h4 class="fish-dialog-paragraph"><strong>Lever i:</strong><br>${fish.livesIn}</h4>
          <h4 class="fish-dialog-paragraph"><strong>Sjov fakta:</strong><br>${fish.funFact}</h4>
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
  const closeButton = document.getElementById("luk-knap-dialog");
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



// ======== DIALOG FUNKTIONER BUNDEN ========

// Henter environment data fra JSON
let allEnvironments = [];
async function getEnvironment() {
  const response = await fetch("./JSON/environment.json");
  const data = await response.json();
  allEnvironments = data.Environment;
}
getEnvironment();


// Åbner dialog ved klik på bund-elementer
document.addEventListener("DOMContentLoaded", function () {
  const skib = document.getElementById("skib-bund");
  const konkylie = document.getElementById("konkylie-bund");
  const tang = document.getElementById("tang-bund");
  const koral = document.getElementById("koral-bund");

  if (skib) {
    skib.addEventListener("click", function() { openBottomModal(1); });
  }
  if (konkylie) {
    konkylie.addEventListener("click", function() { openBottomModal(2); });
  }
  if (tang) {
    tang.addEventListener("click", function() { openBottomModal(3); });
  }
  if (koral) {
    koral.addEventListener("click", function() { openBottomModal(4); });
    }
});


// Åbn dialog med miljø-information
function openBottomModal(environmentId) {
  if (allEnvironments.length === 0) {console.warn("Data ikke indlæst endnu");
  return;
  }

  const dialog = document.getElementById("info-dialog-bottom");
  const content = document.getElementById("dialog-content-bottom");

  // Find det specifikke environment baseret på ID
  const environment = allEnvironments.find((e) => e.id === environmentId);
  if (!environment) {
    console.error("Environment ikke fundet med ID:", environmentId);
    return;
  }

  // Opdater dialog indhold med environment-information
  content.innerHTML = `
  <div class="bund-dialog-container">
    <div class="bund-dialog-left">
      <img src="${environment.image}" alt="${environment.name}" class="fish-dialog-image">
    </div>
    <div class="bund-dialog-right">
      <h2 class="fish-dialog-title">${environment.name}</h2>
      <div class="fish-dialog-info">
        <h4 class="fish-dialog-paragraph"><strong>Beskrivelse:</strong><br>${environment.description}</h4>
        <h4 class="fish-dialog-paragraph"><strong>Sjov fakta:</strong><br>${environment.funFact}</h4>
      </div>
    </div>
    </div>
  `;

  // Åbn dialog
  dialog.showModal();
}

// #6: Luk dialog
function closeBottomModal() {
  const dialog = document.getElementById("info-dialog-bottom");
  dialog.close();
}

// Tilføj event listener til luk-knappen
document.addEventListener("DOMContentLoaded", function () {
  const closeButton = document.getElementById("close-bottom-dialog");
  if (closeButton) {
    closeButton.addEventListener("click", closeBottomModal);
  }

  // Luk dialog hvis man klikker udenfor
  const dialog = document.getElementById("info-dialog-bottom");
  if (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) {
        closeBottomModal();
      }
    });
  }
});


