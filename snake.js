const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 1; // Initial direction (moving right)
let dy = 0;
let score = 0;
let gameInterval;

function startGame() {
    gameInterval = setInterval(updateGame, 100);
}

function updateGame() {
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
    // Clear canvas
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
}

function moveSnake() {
    // Create new head based on velocity direction
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); // Add new head
    snake.pop(); // Remove tail piece to simulate movement
}

function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        scoreElement.textContent = score;
        
        // Grow snake: keep the tail segment by duplicating last segment
        snake.push({ ...snake[snake.length - 1] }); 
        
        spawnFood();
    }
}

function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Prevent food from spawning on top of the snake body
    if (snake.some(part => part.x === food.x && part.y === food.y)) {
        spawnFood();
    }
}

function checkGameOver() {
    const head = snake[0];

    // Wall collisions
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // Self-cannibalism collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Handle control key directions
window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (dy === 0) { dx = 0; dy = -1; } // Prevent switching directly back into self
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
    spawnFood();
    startGame();
}

// Initialize loop
spawnFood();
startGame();
