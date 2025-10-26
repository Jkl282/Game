const startBtn = document.getElementById("start-button");
const musicToggle = document.getElementById("music-toggle");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const bgMusic = document.getElementById("bg-music");

const gameContainer = document.getElementById("game-container");
const restartBtn = document.getElementById("restart");
const message = document.getElementById("message");

let flasks = [];
let selectedFlask = null;
let musicOn = true;

const colors = [
  "color-red", "color-blue", "color-green", "color-yellow",
  "color-pink", "color-cyan", "color-purple", "color-orange"
];

// ====== Старт ======
startBtn.onclick = () => {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  initGame();
  if (musicOn) bgMusic.play();
};

// ====== Музыка ======
musicToggle.onclick = () => {
  musicOn = !musicOn;
  musicToggle.textContent = `Музыка: ${musicOn ? "Вкл" : "Выкл"}`;
  if (musicOn) bgMusic.play();
  else bgMusic.pause();
};

// ====== Частицы ======
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

for (let i = 0; i < 50; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5
  });
}
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#8ecae6";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ====== Логика игры ======
function initGame() {
  gameContainer.innerHTML = "";
  flasks = [];

  const allColors = [];
  colors.slice(0, 4).forEach(c => allColors.push(...Array(4).fill(c)));
  shuffle(allColors);

  const flaskCount = 6;
  for (let i = 0; i < flaskCount; i++) {
    const flask = document.createElement("div");
    flask.classList.add("flask");
    flask.dataset.index = i;
    flask.addEventListener("click", () => handleFlaskClick(i));

    const layers = allColors.splice(0, 4);
    layers.forEach(color => {
      const layer = document.createElement("div");
      layer.classList.add("water-layer", color);
      flask.appendChild(layer);
    });

    gameContainer.appendChild(flask);
    flasks.push(flask);
  }

  // Пустые колбы
  for (let i = 0; i < 2; i++) {
    const emptyFlask = document.createElement("div");
    emptyFlask.classList.add("flask");
    emptyFlask.dataset.index = flasks.length;
    emptyFlask.addEventListener("click", () => handleFlaskClick(flasks.length));
    gameContainer.appendChild(emptyFlask);
    flasks.push(emptyFlask);
  }
}

function handleFlaskClick(index) {
  const flask = flasks[index];
  if (!selectedFlask) {
    if (flask.children.length === 0) return;
    selectedFlask = flask;
    flask.classList.add("selected");
  } else {
    if (flask === selectedFlask) {
      flask.classList.remove("selected");
      selectedFlask = null;
      return;
    }
    pour(selectedFlask, flask);
    selectedFlask.classList.remove("selected");
    selectedFlask = null;
  }
}

function pour(from, to) {
  if (from.children.length === 0) return;
  if (to.children.length >= 4) return;

  const topColor = from.lastElementChild.className;
  const targetColor = to.lastElementChild ? to.lastElementChild.className : topColor;

  if (!targetColor.includes(topColor.split(" ")[1])) return;

  const layer = from.lastElementChild;
  from.removeChild(layer);
  to.appendChild(layer);
  checkWin();
}

function checkWin() {
  const win = flasks.every(flask => {
    if (flask.children.length === 0) return true;
    const first = flask.children[0].className;
    return (
      flask.children.length === 4 &&
      Array.from(flask.children).every(l => l.className === first)
    );
  });
  if (win) message.textContent = "🎉 Победа!";
}

restartBtn.onclick = () => {
  message.textContent = "";
  initGame();
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
