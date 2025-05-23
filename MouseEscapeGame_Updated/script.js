const cursor = document.getElementById("cursor");
const info = document.getElementById("info");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalStats = document.getElementById("finalStats");
const loseSound = document.getElementById("loseSound");
const bgMusic = document.getElementById("bgMusic");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let enemies = [];
let level = 1;
let time = 0;
let enemySpeed = 1;
let spawnRate = 3000;
let mode = "normal";

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = (mouseX - 12.5) + "px";
  cursor.style.top = (mouseY - 12.5) + "px";
});

function spawnEnemy() {
  const enemy = document.createElement("div");
  const type = Math.random();
  if (type < 0.6) {
    enemy.className = "enemy normal";
    enemy.type = "normal";
  } else if (type < 0.85) {
    enemy.className = "enemy fast";
    enemy.type = "fast";
  } else {
    enemy.className = "enemy exploder";
    enemy.type = "exploder";
    setTimeout(() => {
      if (enemies.includes(enemy)) {
        let dx = mouseX - enemy.x;
        let dy = mouseY - enemy.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        createExplosion(enemy.x, enemy.y);
        if (dist < 100) {
          endGame();
        } else {
          enemy.remove();
          enemies = enemies.filter(e => e !== enemy);
        }
      }
    }, 4000);
  }
  enemy.x = Math.random() * window.innerWidth;
  enemy.y = Math.random() * window.innerHeight;
  enemy.style.left = enemy.x + "px";
  enemy.style.top = enemy.y + "px";
  gameArea.appendChild(enemy);
  enemies.push(enemy);
}

function createExplosion(x, y) {
  const boom = document.createElement("div");
  boom.classList.add("explosion");
  boom.style.left = (x - 25) + "px";
  boom.style.top = (y - 25) + "px";
  gameArea.appendChild(boom);
  setTimeout(() => boom.remove(), 400);
}

function endGame() {
  loseSound.play();
  bgMusic.pause();
  createExplosion(mouseX, mouseY);
  gameOverScreen.classList.add("show");
  finalStats.innerText = `You survived ${time} seconds and reached level ${level} (Mode: ${mode})`;
  clearInterval(tickTimer);
  clearInterval(spawnTimer);
  enemies.forEach(e => e.remove());
  enemies = [];
}

function moveEnemies() {
  enemies.forEach((enemy) => {
    let dx = mouseX - enemy.x;
    let dy = mouseY - enemy.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 20) {
      endGame();
    }

    let speedFactor = enemy.type === "fast" ? 2 : 1;
    enemy.x += (dx / dist) * enemySpeed * speedFactor;
    enemy.y += (dy / dist) * enemySpeed * speedFactor;

    enemy.style.left = enemy.x + "px";
    enemy.style.top = enemy.y + "px";
  });
}

function updateGame() {
  time++;
  info.innerText = `Level: ${level} | Time: ${time}s | Mode: ${mode}`;

  if (time % 10 === 0) {
    level++;
    enemySpeed += 0.2;
    spawnRate = Math.max(500, spawnRate - 200);
    document.body.style.background = `linear-gradient(135deg, hsl(${level * 30}, 70%, 30%), #000)`;
  }
}

function gameLoop() {
  moveEnemies();
  requestAnimationFrame(gameLoop);
}

function setMode(selectedMode) {
  mode = selectedMode;
  if (mode === "easy") {
    enemySpeed = 0.5;
    spawnRate = 4000;
  } else if (mode === "hard") {
    enemySpeed = 1.5;
    spawnRate = 1500;
  }
  document.getElementById("modeMenu").style.display = "none";
  tickTimer = setInterval(updateGame, 1000);
  spawnTimer = setInterval(spawnEnemy, spawnRate);
  gameLoop();
}
