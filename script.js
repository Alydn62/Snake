// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right'; // Default direction is right
let gameInterval;
let gameSpeedDelay = 200; // Default speed (level 5)
let gameStarted = false;
let snakeColor = '#5a5a5a'; // Default snake color

// Speed and color control elements
const colorControl = document.getElementById('colorControl');

// Event listener untuk color control (color picker)
colorControl.addEventListener('input', (e) => {
  snakeColor = e.target.value;
});

// Event listeners untuk tombol kontrol
document.getElementById('up').addEventListener('click', () => {
  if (direction !== 'down') direction = 'up';
});

document.getElementById('down').addEventListener('click', () => {
  if (direction !== 'up') direction = 'down';
});

document.getElementById('left').addEventListener('click', () => {
  if (direction !== 'right') direction = 'left';
});

document.getElementById('right').addEventListener('click', () => {
  if (direction !== 'left') direction = 'right';
});

// Draw game map, snake, food
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

// Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    snakeElement.style.backgroundColor = snakeColor; // Apply selected color
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
  } else {
    snake.pop();
  }
}

// Start game function
function startGame() {
  gameStarted = true; // Keep track of a running game
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame();
  } else {
    // Prevent the snake from reversing direction
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'down') {
          direction = 'up';
        }
        break;
      case 'ArrowDown':
        if (direction !== 'up') {
          direction = 'down';
        }
        break;
      case 'ArrowLeft':
        if (direction !== 'right') {
          direction = 'left';
        }
        break;
      case 'ArrowRight':
        if (direction !== 'left') {
          direction = 'right';
        }
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress);

// Increase game speed as snake eats food
function increaseSpeed() {
  if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 10;
  }
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200; // Reset to default speed
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}
