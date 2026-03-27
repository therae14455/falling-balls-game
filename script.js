const game = document.getElementById("game");
const scoreText = document.getElementById("score");

let config;
fetch("config.json")
  .then(res => res.json())
  .then(data => {
    config = data;
    initGame();
  });

let playerX = 175;
let score = 0;

function initGame() {
    // Player
    const player = document.createElement("div");
    player.id = "player";
    player.style.width = config.player.width + "px";
    player.style.height = config.player.height + "px";
    player.style.left = playerX + "px";
    player.style.bottom = "10px";
    game.appendChild(player);

    // Player hareketi
    document.addEventListener("keydown", e => {
        if(e.key === "ArrowLeft" && playerX > 0) playerX -= config.player.speed;
        if(e.key === "ArrowRight" && playerX < 400 - config.player.width) playerX += config.player.speed;
        player.style.left = playerX + "px";
    });

    // Düşman oluştur
    function createEnemy() {
        const enemy = document.createElement("div");
        enemy.className = "enemy";
        enemy.style.width = config.enemy.width + "px";
        enemy.style.height = config.enemy.height + "px";
        enemy.style.left = Math.random() * (400 - config.enemy.width) + "px";
        enemy.style.top = "0px";
        game.appendChild(enemy);

        let y = 0;
        const fall = setInterval(() => {
            y += config.enemy.speed;
            enemy.style.top = y + "px";

            // Çarpışma
            if(y + config.enemy.height >= 500 - config.player.height &&
               parseInt(enemy.style.left) < playerX + config.player.width &&
               parseInt(enemy.style.left) + config.enemy.width > playerX) {
                alert("Oyun Bitti! Skor: " + score);
                location.reload();
            }

            if(y > 500) {
                enemy.remove();
                clearInterval(fall);
                score++;
                scoreText.innerText = "Skor: " + score;
            }
        }, 30);
    }

    setInterval(createEnemy, config.enemy.spawnRate);

    // Power-up oluştur
    function createPowerup() {
        const powerup = document.createElement("div");
        powerup.className = "powerup";
        powerup.style.width = config.powerup.width + "px";
        powerup.style.height = config.powerup.height + "px";
        powerup.style.left = Math.random() * (400 - config.powerup.width) + "px";
        powerup.style.top = "0px";
        game.appendChild(powerup);

        let y = 0;
        const fall = setInterval(() => {
            y += config.powerup.speed;
            powerup.style.top = y + "px";

            if(y + config.powerup.height >= 500 - config.player.height &&
               parseInt(powerup.style.left) < playerX + config.player.width &&
               parseInt(powerup.style.left) + config.powerup.width > playerX) {
                score += 5; // Bonus skor
                scoreText.innerText = "Skor: " + score;
                powerup.remove();
                clearInterval(fall);
            }

            if(y > 500) {
                powerup.remove();
                clearInterval(fall);
            }
        }, 30);
    }

    setInterval(createPowerup, config.powerup.spawnRate);
}
