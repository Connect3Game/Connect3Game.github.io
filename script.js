document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const restartButton = document.getElementById('restart-btn');
    const playerTurnDisplay = document.getElementById('player-turn');
    const columns = 3;
    const rows = 6;

    let currentPlayer = 'player1';
    let gameState = Array(rows).fill(null).map(() => Array(columns).fill(null));
    let gameActive = true;

    // Initialize the game board
    function initializeBoard() {
        const cells = board.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.innerHTML = ''; // Clear any existing discs
            cell.classList.remove('winning-cell'); // Reset winner highlights
        });
    }

    // Check for a win
    function checkWin(player) {
        // Check horizontal, vertical, and diagonal lines for a win
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                // Horizontal check
                if (col + 2 < columns &&
                    gameState[row][col] === player &&
                    gameState[row][col + 1] === player &&
                    gameState[row][col + 2] === player) {
                    return [
                        { row, col },
                        { row, col: col + 1 },
                        { row, col: col + 2 }
                    ];
                }
                // Vertical check
                if (row + 2 < rows &&
                    gameState[row][col] === player &&
                    gameState[row + 1][col] === player &&
                    gameState[row + 2][col] === player) {
                    return [
                        { row, col },
                        { row: row + 1, col },
                        { row: row + 2, col }
                    ];
                }
                // Diagonal (top-left to bottom-right) check
                if (row + 2 < rows && col + 2 < columns &&
                    gameState[row][col] === player &&
                    gameState[row + 1][col + 1] === player &&
                    gameState[row + 2][col + 2] === player) {
                    return [
                        { row, col },
                        { row: row + 1, col: col + 1 },
                        { row: row + 2, col: col + 2 }
                    ];
                }
                // Diagonal (top-right to bottom-left) check
                if (row + 2 < rows && col - 2 >= 0 &&
                    gameState[row][col] === player &&
                    gameState[row + 1][col - 1] === player &&
                    gameState[row + 2][col - 2] === player) {
                    return [
                        { row, col },
                        { row: row + 1, col: col - 1 },
                        { row: row + 2, col: col - 2 }
                    ];
                }
            }
        }
        return null; // No win
    }

    // Check for a draw
    function checkDraw() {
        return gameState.every(row => row.every(cell => cell !== null));
    }

    // Update player turn display
    function updatePlayerTurnDisplay() {
        playerTurnDisplay.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="disc ${currentPlayer}" style="width: 20px; height: 20px; border-radius: 50%;"></div>
                <span>${currentPlayer === 'player1' ? "Player 1's Turn" : "Player 2's Turn"}</span>
            </div>
        `;
    }

    // Highlight the winning cells
    function highlightWinningCells(winningCells) {
        winningCells.forEach(cell => {
            const targetCell = document.querySelector(`.cell[data-row="${cell.row}"][data-col="${cell.col}"]`);
            targetCell.classList.add('winning-cell'); // Add the highlight
        });
    }

    // Handle cell click
    function handleCellClick(event) {
        if (!gameActive) return;

        const cell = event.target;
        if (!cell.classList.contains('cell')) return;

        const col = parseInt(cell.dataset.col);

        // Find the lowest empty cell in the column
        for (let row = rows - 1; row >= 0; row--) {
            if (!gameState[row][col]) {
                gameState[row][col] = currentPlayer;

                const targetCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                const disc = document.createElement('div');
                disc.classList.add('disc', currentPlayer);

                const animationDuration = 0.1 + (rows - row) * 0.1;
                disc.style.animationDuration = `${animationDuration}s`;
                targetCell.appendChild(disc);

                setTimeout(() => {
                    const winningCells = checkWin(currentPlayer);
                    if (winningCells) {
                        gameActive = false;
                        highlightWinningCells(winningCells); // Highlight the winning cells
                        setTimeout(() => {
                            alert(`${currentPlayer === 'player1' ? 'Player 1 (Red)' : 'Player 2 (Yellow)'} wins!`);
                        }, 500);
                        return;
                    } else if (checkDraw()) {
                        gameActive = false;
                        setTimeout(() => {
                            alert("It's a draw!");
                        }, 500);
                        return;
                    }

                    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
                    updatePlayerTurnDisplay();
                }, animationDuration * 1000);

                return;
            }
        }
    }

    // Restart the game
    function restartGame() {
        gameState = Array(rows).fill(null).map(() => Array(columns).fill(null));
        currentPlayer = 'player1';
        gameActive = true;

        document.querySelectorAll('.disc').forEach(disc => disc.remove());
        updatePlayerTurnDisplay();
        initializeBoard();
    }

    // Event Listeners
    board.addEventListener('click', handleCellClick);
    restartButton.addEventListener('click', restartGame);

    // Initial setup
    initializeBoard();
    updatePlayerTurnDisplay();
});

