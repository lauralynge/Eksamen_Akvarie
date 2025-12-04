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