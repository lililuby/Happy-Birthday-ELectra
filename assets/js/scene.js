const envelope = document.getElementById("envelope");
const clickInstruction = document.getElementById("clickInstruction");
const soundToggle = document.getElementById("soundToggle");
const nextBtn = document.getElementById("nextBtn");
const transition = document.getElementById("transition");
const particles = document.getElementById("particles");

let soundEnabled = true;
let envelopeOpened = false;
let audioContext = null;
let audioReady = false;

let musicPlaying = false;

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

// buka amplop
envelope.addEventListener("click", () => {
  envelope.classList.add("open");

  // PLAY MUSIC (AMAN)
  if (!musicPlaying) {
    bgMusic.volume = 0.6;
    bgMusic.play().catch(() => {});
    musicPlaying = true;
    soundToggle.textContent = "🔊";
  }
});

// toggle sound
soundToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    soundToggle.textContent = "🔊";
  } else {
    bgMusic.pause();
    soundToggle.textContent = "🔇";
  }
});

bgMusic.volume = 0;

function fadeInMusic() {
  let vol = 0;
  const fade = setInterval(() => {
    if (vol < 0.6) {
      vol += 0.02;
      bgMusic.volume = vol;
    } else {
      clearInterval(fade);
    }
  }, 100);
}



// Create particles
function createParticles() {
  const particleCount = window.innerWidth < 768 ? 15 : 25;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    const size = Math.random() * 6 + 2;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 8 + "s";
    particle.style.animationDuration = Math.random() * 6 + 6 + "s";
    particles.appendChild(particle);
  }
}

createParticles();

// Sound effects
function playSound(frequency, duration, type = "sine") {
  if (!soundEnabled || !audioReady) return;

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.log("Audio not supported");
  }
}

// Play melodic sound for letter opening
function playLetterOpenSound() {
  if (!soundEnabled) return;

  const notes = [523.25, 587.33, 659.25, 783.99]; // C5, D5, E5, G5
  notes.forEach((note, index) => {
    setTimeout(() => playSound(note, 0.3, "sine"), index * 150);
  });
}

// Sound toggle
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
  playSound(800, 0.1, "square");
});

// Open envelope
envelope.addEventListener("click", () => {
  if (envelopeOpened) return;

  envelopeOpened = true;
  envelope.classList.add("opened");
  clickInstruction.classList.add("hidden");

  // Play sound
  playLetterOpenSound();

  // Show next button after reading time
  setTimeout(() => {
    nextBtn.classList.add("show");
    playSound(600, 0.2, "sine");
  }, 4000);
});

// Next button
nextBtn.addEventListener("click", () => {
  playSound(800, 0.2, "square");
  transition.classList.add("active");

  setTimeout(() => {
    // Navigate to scene 3 or show message
    window.location.href = "scene2.html";


    transition.classList.remove("active");
  }, 600);
});

// Auto play background music sound (soft ambient)
function playAmbientSound() {
  if (!soundEnabled) return;

  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 220; // A3
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
  } catch (e) {
    console.log("Audio not supported");
  }
}


// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);
