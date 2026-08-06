const musicPlayerWidget = document.getElementById("musicPlayerWidget");
const vinylDiscBtn = document.getElementById("vinylDiscBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const seekBackBtn = document.getElementById("seekBackBtn");
const seekForwardBtn = document.getElementById("seekForwardBtn");
const progressSlider = document.getElementById("progressSlider");
const timeDisplay = document.getElementById("timeDisplay");
const volumeSlider = document.getElementById("volumeSlider");
const music = document.getElementById("backgroundMusic");
const video = document.querySelector(".background-video");
const copyDiscord = document.getElementById("copyDiscord");
const optionalImages = document.querySelectorAll("[data-optional-image]");

music.volume = parseFloat(volumeSlider?.value || 0.35);

optionalImages.forEach((image) => {
  image.addEventListener("error", () => image.classList.add("missing"));
});

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function setSoundState(isPlaying) {
  if (musicPlayerWidget) {
    musicPlayerWidget.classList.toggle("is-playing", isPlaying);
  }
}

async function toggleMusic() {
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
}

const loopBtn = document.getElementById("loopBtn");

if (vinylDiscBtn) vinylDiscBtn.addEventListener("click", toggleMusic);
if (playPauseBtn) playPauseBtn.addEventListener("click", toggleMusic);

if (loopBtn) {
  loopBtn.addEventListener("click", () => {
    music.loop = !music.loop;
    loopBtn.classList.toggle("is-active", music.loop);
    loopBtn.title = music.loop ? "Tắt lặp lại bài" : "Bật lặp lại bài";
  });
}

if (seekBackBtn) {
  seekBackBtn.addEventListener("click", () => {
    music.currentTime = Math.max(0, music.currentTime - 10);
  });
}

if (seekForwardBtn) {
  seekForwardBtn.addEventListener("click", () => {
    if (music.duration) {
      music.currentTime = Math.min(music.duration, music.currentTime + 10);
    } else {
      music.currentTime += 10;
    }
  });
}

let isSeeking = false;

if (progressSlider) {
  progressSlider.addEventListener("mousedown", () => { isSeeking = true; });
  progressSlider.addEventListener("touchstart", () => { isSeeking = true; });
  progressSlider.addEventListener("change", () => { isSeeking = false; });
  progressSlider.addEventListener("mouseup", () => { isSeeking = false; });
  progressSlider.addEventListener("touchend", () => { isSeeking = false; });

  progressSlider.addEventListener("input", (e) => {
    if (music.duration) {
      const targetTime = (parseFloat(e.target.value) / 100) * music.duration;
      music.currentTime = targetTime;
    }
  });
}

const volumeBox = document.getElementById("volumeBox");
const volumeBtn = document.getElementById("volumeBtn");

let lastVolume = parseFloat(volumeSlider?.value || 0.35);

function updateVolumeState(vol) {
  if (!volumeBox) return;
  volumeBox.classList.remove("is-muted", "is-low", "is-high");
  if (vol <= 0) {
    volumeBox.classList.add("is-muted");
  } else if (vol <= 0.5) {
    volumeBox.classList.add("is-low");
  } else {
    volumeBox.classList.add("is-high");
  }
}

updateVolumeState(music.volume);

if (volumeSlider) {
  volumeSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    music.volume = val;
    if (val > 0) lastVolume = val;
    updateVolumeState(val);
  });
}

if (volumeBtn) {
  volumeBtn.addEventListener("click", () => {
    if (music.volume > 0) {
      lastVolume = music.volume;
      music.volume = 0;
      if (volumeSlider) volumeSlider.value = 0;
      updateVolumeState(0);
    } else {
      const restored = lastVolume > 0 ? lastVolume : 0.35;
      music.volume = restored;
      if (volumeSlider) volumeSlider.value = restored;
      updateVolumeState(restored);
    }
  });
}

music.addEventListener("timeupdate", () => {
  if (music.duration) {
    if (!isSeeking && progressSlider) {
      progressSlider.value = (music.currentTime / music.duration) * 100;
    }
    if (timeDisplay) {
      timeDisplay.innerHTML = `${formatTime(music.currentTime)} <span class="time-total">/ ${formatTime(music.duration)}</span>`;
    }
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
      music
        .play()
        .then(() => {
          setSoundState(true);
        })
        .catch((err) => {
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
