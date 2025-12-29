// Memory data
const memories = [
  {
    image: "assets/img/slide/memory1.jpg",
    caption: "I remember taking this when u fell asleep in the game. Hope u don't do that all the time, lol.",
  },
  {
    image: "assets/img/slide/memory2.jpg",
    caption: "Can't wait to put u in Thorns again HAHAHA",
  },
  {
    image: "assets/img/slide/memory3.jpg",
    caption: "aww..it's so cuteee.. btw, Where did ur clothes go?",
  },
  {
    image: "assets/img/slide/memory4.jpg",
    caption: "Look at uuuu so small, Can i step on it?",
  },
  {
    image: "assets/img/slide/memory5.jpg",
    caption: "OMG THIS IS OUR FIRST MEET",
  },
];

// State
let currentIndex = 0;
let soundEnabled = true;
let candlesBlown = 0;
let audioContext = null;
let audioReady = false;


// Elements
const photoFramesContainer = document.getElementById("photoFrames");
const progressIndicator = document.getElementById("progressIndicator");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const cakeScene = document.getElementById("cakeScene");
const birthdayCake = document.getElementById("birthdayCake");
const cakeInstruction = document.getElementById("cakeInstruction");
const finalMessage = document.getElementById("finalMessage");
const soundToggle = document.getElementById("soundToggle");
const backBtn = document.getElementById("backBtn");
const transition = document.getElementById("transition");
const hearts = document.getElementById("hearts");

// Create hearts
function createHearts() {
  const heartCount = window.innerWidth < 768 ? 15 : 25;
  const heartSymbols = ["💖", "💗", "💕", "💓", "💝"];

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent =
      heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.top = Math.random() * 100 + "%";
    heart.style.animationDelay = Math.random() * 8 + "s";
    heart.style.animationDuration = Math.random() * 6 + 6 + "s";
    hearts.appendChild(heart);
  }
}

createHearts();

document.addEventListener(
  "click",
  () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      audioContext.resume();
      audioReady = true;
    }
  },
  { once: true }
);
// Sound effects
function playSound(frequency, duration, type = "sine") {
  if (!soundEnabled || !audioReady) return;


  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration
  );

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

// Play melody
function playMelody() {
  const notes = [
    { freq: 523.25, time: 0 },
    { freq: 523.25, time: 200 },
    { freq: 587.33, time: 400 },
    { freq: 523.25, time: 600 },
    { freq: 698.46, time: 800 },
    { freq: 659.25, time: 1000 },
  ];

  notes.forEach((note) => {
    setTimeout(() => playSound(note.freq, 0.3, "sine"), note.time);
  });
}

// Create confetti
function createConfetti() {
  const colors = [
    "#FF69B4",
    "#FF1493",
    "#FFB6C1",
    "#FFC0CB",
    "#FFD700",
    "#FF69B4",
  ];
  const confettiCount = window.innerWidth < 768 ? 40 : 60;
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = "-10px";
      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = confetti.style.width;
      confetti.style.animation = `confettiFall ${
        Math.random() * 2 + 3
      }s linear forwards`;
      confetti.style.opacity = "1";
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }, i * 20);
  }
}
// Generate photo frames
function generatePhotoFrames() {
  memories.forEach((memory, index) => {
    const frame = document.createElement("div");
    frame.className = "photo-frame";

    frame.innerHTML = `
      <div class="photo-container">
        <img 
          src="${memory.image}" 
          alt="Memory ${index + 1}"
          onerror="this.parentElement.innerHTML='<div class=photo-placeholder>Foto ${
            index + 1
          }<br>📸</div>'"
        >
      </div>
      <div class="photo-caption">${memory.caption}</div>
    `;

    photoFramesContainer.appendChild(frame);
  });
}

// Generate progress dots
function generateProgressDots() {
  for (let i = 0; i < memories.length; i++) {
    const dot = document.createElement("div");
    dot.className = "progress-dot";
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => goToSlide(i));
    progressIndicator.appendChild(dot);
  }
}

// Update display
function updateDisplay() {
  const frames = document.querySelectorAll(".photo-frame");
  const dots = document.querySelectorAll(".progress-dot");

  frames.forEach((frame, index) => {
    frame.classList.remove("active", "exit-left");
    if (index === currentIndex) frame.classList.add("active");
    else if (index < currentIndex) frame.classList.add("exit-left");
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });

  prevBtn.classList.toggle("disabled", currentIndex === 0);
  nextBtn.classList.toggle("disabled", currentIndex >= memories.length);

  if (currentIndex === memories.length) {
    cakeScene.classList.add("active");
    playSound(523.25, 0.3, "sine");
  } else {
    cakeScene.classList.remove("active");
  }
}

// Go to specific slide
function goToSlide(index) {
  if (index >= 0 && index <= memories.length) {
    currentIndex = index;
    updateDisplay();
    playSound(600, 0.1, "square");
  }
}

// Blow candle
birthdayCake.addEventListener("click", () => {
  const flames = document.querySelectorAll(".flame:not(.blown)");
  if (!flames.length) return;

  flames[0].classList.add("blown");
  candlesBlown++;

  playSound(300 - candlesBlown * 30, 0.4, "sine");

  if (candlesBlown >= 5) {
    setTimeout(() => {
      cakeInstruction.style.opacity = "0";
      finalMessage.classList.add("show");
      createConfetti();
      playMelody();
    }, 500);
  }
});

// Navigation
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateDisplay();
    playSound(500, 0.1, "square");
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < memories.length) {
    currentIndex++;
    updateDisplay();
    playSound(700, 0.1, "square");
  }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prevBtn.click();
  if (e.key === "ArrowRight") nextBtn.click();
});

// Touch swipe
let touchStartX = 0;
document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});
document.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50) nextBtn.click();
  if (touchEndX > touchStartX + 50) prevBtn.click();
});

// Sound toggle
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
  playSound(800, 0.1, "square");
});

// Back button
backBtn.addEventListener("click", () => {
  playSound(400, 0.2, "square");
  transition.classList.add("active");
  setTimeout(() => window.history.back(), 600);
});

// Initialize
generatePhotoFrames();
generateProgressDots();
updateDisplay();

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  },
  false
);
