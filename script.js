const soundButton = document.getElementById("soundButton");
const music = document.getElementById("backgroundMusic");
const video = document.querySelector(".background-video");
const copyDiscord = document.getElementById("copyDiscord");
const optionalImages = document.querySelectorAll("[data-optional-image]");

// Nhạc được thiết lập âm lượng nhưng chỉ phát khi bấm vào
music.volume = 0.35;

optionalImages.forEach((image) => {
  image.addEventListener("error", () => image.classList.add("missing"));
});

function setSoundState(isPlaying) {
  soundButton.classList.toggle("is-playing", isPlaying);
  soundButton.setAttribute("aria-pressed", String(isPlaying));
  soundButton.setAttribute("aria-label", isPlaying ? "Tắt nhạc" : "Bật nhạc");
  soundButton.querySelector(".sound-tooltip").textContent = isPlaying ? "Tắt nhạc" : "Bật nhạc";
}

soundButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      setSoundState(true);
    } catch {
      setSoundState(false);
    }
  } else {
    music.pause();
    setSoundState(false);
  }
});

music.addEventListener("pause", () => setSoundState(false));
music.addEventListener("playing", () => setSoundState(true));

copyDiscord.addEventListener("click", async () => {
  const username = "Itssang_";
  try {
    await navigator.clipboard.writeText(username);
  } catch {
    const field = document.createElement("textarea");
    field.value = username;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }

  copyDiscord.classList.add("copied");
  window.setTimeout(() => copyDiscord.classList.remove("copied"), 1800);
});

// --- Enter Screen Logic ---
const enterScreen = document.getElementById("enterScreen");
const enterBtn = document.getElementById("enterBtn");

if (enterBtn && enterScreen) {
  enterBtn.addEventListener("click", () => {
    // Hide screen instantly to make it feel responsive
    enterScreen.classList.add("hidden");
    
    // Add entered class to trigger CSS animations
    document.body.classList.add("entered");
    
    // Play music asynchronously
    if (music.paused) {
      music.play().then(() => {
        setSoundState(true);
      }).catch(err => {
        console.error("Autoplay prevented", err);
      });
    }
    
    // Play video if it was paused
    if (video.paused) {
      video.play().catch(() => {});
    }
    
    // Remove from DOM after fade out transition
    setTimeout(() => {
      enterScreen.remove();
    }, 800);
  });
}
