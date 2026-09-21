const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const pauseBtn = document.getElementById("pauseBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 1; 
let dy = 0;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0; // Load saved high score
let gameInterval;
let isPaused = false;

// Display initial high score
highScoreElement.textContent = highScore;

function startGame() {
    gameInterval = setInterval(updateGame, 100);
}

function updateGame() {
    if (isPaused) return; // Freeze execution loop if paused

    moveSnake();
    
    if (checkGameOver()) {
        clearInterval(gameInterval);
        alert(`Game Over! Final Score: ${score}`);
        resetGame();
        return;
    }

    checkFoodCollision();
    draw();
}

function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    ctx.fillStyle = "#4CAF50";
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw Food
    ctx.fillStyle = "#FF5722";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Visual Pause Overlay Text
    if (isPaused) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
    }
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    snake.pop();
}

function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        scoreElement.textContent = score;
        
        // Track and update high score immediately during play
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem("snakeHighScore", highScore); // Save to browser storage
        }

        snake.push({ ...snake[snake.length - 1] }); 
        spawnFood();
    }
}

function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    if (snake.some(part => part.x === food.x && part.y === food.y)) {
        spawnFood();
    }
}

function checkGameOver() {
    const head = snake[0];

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
    if (isPaused) {
        draw(); // Redraw immediately to apply the grey overlay text
    }
}

// Click listener for the UI button
pauseBtn.addEventListener("click", togglePause);

window.addEventListener("keydown", e => {
    // Prevent Arrow keys and Spacebar from scrolling the web browser window
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }

    // Toggle pause with Spacebar
    if (e.key === " " || e.key === "Spacebar") {
        togglePause();
        return;
    }

    // Ignore direction commands while paused
    if (isPaused) return;

    switch (e.key) {
        case "ArrowUp":
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case "ArrowDown":
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case "ArrowLeft":
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case "ArrowRight":
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    isPaused = false;
    pauseBtn.textContent = "Pause";
    spawnFood();
    startGame();
}

spawnFood();
startGame();
