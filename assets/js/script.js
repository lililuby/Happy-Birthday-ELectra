const ambilBtn = document.getElementById("ambilBtn");
  const character = document.getElementById("character");
  const house = document.getElementById("house");
  const game = document.querySelector(".game");
  const transition = document.getElementById("transition");
  const soundToggle = document.getElementById("soundToggle");
  const progressBar = document.getElementById("progressBar");
  const stars = document.getElementById("stars");
  const instruction = document.getElementById("instruction");
  const dialogBox = document.getElementById("dialogBox");
  const dialogOverlay = document.getElementById("dialogOverlay");
  const dialogText = document.getElementById("dialogText");
  const dialogOptions = document.getElementById("dialogOptions");
  
  let soundEnabled = true;
  let characterOut = false;
  let currentDialogStep = 0;

  // Dialog conversation
  const dialogSteps = [
    {
      text: "Hm? Ada surat di depan rumah... 🤔",
      options: [
        { text: "Lihat surat", next: 1 }
      ]
    },
    {
      text: "Surat ini... tidak ada nama pengirimnya? Aneh sekali... 🧐",
      options: [
        { text: "Periksa lebih dekat", next: 2 }
      ]
    },
    {
      text: "Amplop ini berwarna emas dan berkilau... seperti ada sesuatu yang istimewa di dalamnya! ✨",
      options: [
        { text: "Ambil suratnya", action: "take" },
        { text: "Biarkan saja", action: "ignore" }
      ]
    }
  ];

  // Create stars background
  function createStars() {
    const starCount = window.innerWidth < 768 ? 30 : 50;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3 + 1;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (Math.random() * 2 + 2) + 's';
      stars.appendChild(star);
    }
  }

  createStars();

  // Show dialog function
  function showDialog(stepIndex) {
    const step = dialogSteps[stepIndex];
    currentDialogStep = stepIndex;
    
    dialogText.textContent = step.text;
    dialogOptions.innerHTML = '';
    
    // Create option buttons
    step.options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = option.action === 'ignore' ? 'dialog-btn secondary' : 'dialog-btn';
      btn.textContent = option.text;
      
      btn.addEventListener('click', () => {
        playSound(800, 0.1);
        
        if (option.action === 'take') {
          // Close dialog and enable letter taking
          closeDialog();
          instruction.textContent = '🎮 Klik tangan untuk mengambil surat misterius';
          ambilBtn.style.pointerEvents = 'auto';
        } else if (option.action === 'ignore') {
          // Close dialog but don't enable
          closeDialog();
          instruction.textContent = '💭 Sepertinya character tidak tertarik... Coba klik rumah lagi!';
          characterOut = false;
          setTimeout(() => {
            character.classList.add('walking');
            character.style.left = '20%';
            setTimeout(() => {
              character.classList.add('hidden');
              character.classList.remove('walking');
              instruction.textContent = '🏠 Klik rumah untuk memulai! 🎮';
            }, 2500);
          }, 1000);
        } else if (option.next !== undefined) {
          // Go to next dialog
          showDialog(option.next);
        }
      });
      
      dialogOptions.appendChild(btn);
    });
    
    // Show dialog
    dialogOverlay.classList.add('active');
    dialogBox.classList.add('active');
    playSound(600, 0.15);
  }

  function closeDialog() {
    dialogOverlay.classList.remove('active');
    dialogBox.classList.remove('active');
  }

  // Simple sound effect
  function playSound(frequency, duration) {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.log('Audio not supported');
    }
  }

  // Create confetti particles
  function createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD93D', '#C44569'];
    const letterArea = document.querySelector('.letter-area');
    const rect = letterArea.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();
    
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-particle';
        confetti.style.left = (rect.left - gameRect.left + 40) + 'px';
        confetti.style.top = (rect.top - gameRect.top + 40) + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 8 + 4) + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.animation = `confettiFall ${Math.random() * 1.5 + 2}s ease-out forwards`;
        confetti.style.opacity = '1';
        confetti.style.transform = `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`;
        
        game.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3500);
      }, i * 40);
    }
  }

  // Sound toggle functionality
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    playSound(800, 0.1);
  });

  // Hover sound effect (only when enabled)
  ambilBtn.addEventListener('mouseenter', () => {
    if (ambilBtn.style.pointerEvents !== 'none') {
      playSound(600, 0.05);
    }
  });

  // House click - Character keluar dari rumah
  house.addEventListener('click', () => {
    if (characterOut) return; // Prevent multiple clicks
    
    characterOut = true;
    
    // Play door opening sound
    playSound(400, 0.2);
    
    // Shake house
    house.classList.add('shake');
    setTimeout(() => house.classList.remove('shake'), 500);
    
    // Character keluar dari rumah
    setTimeout(() => {
      character.classList.remove('hidden');
      character.classList.add('exiting');
      playSound(300, 0.3);
    }, 300);
    
    // Character berjalan ke posisi tengah
    setTimeout(() => {
      character.classList.remove('exiting');
      character.classList.add('walking');
      character.style.left = '30%';
      playSound(250, 0.2);
      
      // Update instruction
      instruction.textContent = '💬 Character sedang berpikir...';
    }, 800);
    
    // Stop walking animation
    setTimeout(() => {
      character.classList.remove('walking');
      playSound(500, 0.15);
      
      // Show dialog after character stops
      setTimeout(() => {
        showDialog(0);
      }, 500);
    }, 3300);
  });

  // Main click handler
  ambilBtn.addEventListener("click", () => {
    if (!characterOut) {
      alert("⚠️ Character masih di dalam rumah! Klik rumah dulu untuk memanggilnya keluar.");
      playSound(300, 0.2);
      return;
    }
    
    // Disable button immediately
    ambilBtn.style.pointerEvents = "none";
    
    // Play click sound
    playSound(1000, 0.15);
    
    // Create confetti effect
    createConfetti();
    
    // Show progress bar
    progressBar.classList.add('active');
    
    // Add walking animation
    character.classList.add('walking');
    
    // Move character to letter
    character.style.left = "69%";
    
    // Disable button
    ambilBtn.classList.add('disabled');
    
    // Play walking sound
    let walkSoundInterval = setInterval(() => {
      playSound(200, 0.1);
    }, 300);
    
    // Stop walking sound and show transition
    setTimeout(() => {
      clearInterval(walkSoundInterval);
      character.classList.remove('walking');
      playSound(1200, 0.2);
    }, 2400);

    setTimeout(() => {
      transition.classList.add('active');
    }, 2500);

    // Navigate to next scene
    setTimeout(() => {
      
      // Demo: Show alert and reset
      window.location.href = "scene.html";
      
      // Reset for demo purposes
      transition.classList.remove('active');
      progressBar.classList.remove('active');
      character.style.left = "62%";
      character.classList.add('hidden');
      character.style.left = "15%";
      ambilBtn.classList.remove('disabled');
      ambilBtn.style.pointerEvents = "auto";
      characterOut = false;
      instruction.textContent = '🏠 Klik rumah untuk memulai! 🎮';
    }, 3100);
  });

  // Easter egg: Click character for surprise
  let clickCount = 0;
  character.addEventListener('click', () => {
    clickCount++;
    playSound(400 + (clickCount * 100), 0.1);
    character.style.transform = `rotate(${clickCount * 10}deg) scale(${1 + clickCount * 0.05})`;
    
    if (clickCount >= 5) {
      createConfetti();
      alert("🎊 Kamu menemukan Easter Egg! Character dance! 💃");
      clickCount = 0;
      character.style.transform = 'rotate(0deg) scale(1)';
    }
    
    setTimeout(() => {
      character.style.transform = 'rotate(0deg) scale(1)';
    }, 500);
  });

  // Prevent zoom on double tap for mobile
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);