// game board
const gameBoard = (() => {
    let values = new Array(9).fill('');

    const getValue = (index) => {
        return values[index];
    }

    const setValue = (index, newValue) => {
        // if (!(gameController.gameOver()) && values[index] === '') {
        //     values[index] = newValue;
        // }
        values[index] = newValue;
    }

    const clear = () => values.fill('');

    const getValues = () => values;

    const isOpen = (index) => {
        return getValue(index) === '';
    }

    return {
        getValue,
        setValue,
        getValues,
        clear,
        isOpen
    };
})();

// player factory
const Player = (name, symbol) => {
    const getName = () => {
        return name;
    }

    const getSymbol = () => {
        return symbol;
    }

    return {
        getName,
        getSymbol
    };
}

// AI player
const AI = (name, symbol, opponent, accuarcy) => {
    const prototype = Player(name, symbol);
    const board = gameBoard;
    const minimax = (board, depth, isMax) => {
        let score = evaluate(board.getValues());
        if (Math.abs(score) === 10 ) return score;

        if (gameController.checkFull(board.getValues())) return 0;

        if (isMax) {
            let best = -Infinity;

            for (let i = 0; i < board.getValues().length; i++) {
                if (board.isOpen(i)) {
                    board.setValue(i, symbol);
                    best = Math.max(best, minimax(board, depth + 1, !isMax));
                    board.setValue(i, '');
                }
            }
            // console.log(`Move ${best}; Board - ${board.getValues()}`);
            return best;
        } else {
            let best = Infinity;

            for (let i = 0; i < board.getValues().length; i++) {
                if (board.isOpen(i)) {
                    board.setValue(i, opponent.getSymbol());
                    best = Math.min(best, minimax(board, depth + 1, !isMax))
                    board.setValue(i, '');
                }
            }
            return best;
        }
    }

    const getBestMove = (board) => {
        let bestValue = -Infinity;
        var bestMove = -1;
        for (let i = 0; i < board.getValues().length; i++) {
            if (board.isOpen(i)) {
                board.setValue(i, symbol);
                let currentValue = minimax(board, 0, false);
                board.setValue(i, '');

                if (currentValue > bestValue) {
                    bestMove = i;
                    bestValue = currentValue;
                }
            }
        }
        // console.log(`The Best Move is: ${bestMove}`);
        return bestMove;
    }

    const evaluate = (board) => {
        let winner = gameController.getWinnerSymbol(board);
        if (winner) {
            if (winner === symbol) {
                return 10;
            } else {
                return -10;
            }
        } else {
            return 0;
        }
    }

    const selectSquare = () => {
        let selection;
        let rand = Math.random() > accuarcy;
        if (rand) {
        // randomly select a space on the board
            do {
                selection = Math.floor(Math.random()  *  10);
            } while (board.getValue(selection) !== '');
        } else {
        // use minimax 
            selection = getBestMove(board);
        }
        return selection;
    }

    const placeSymbol = () => {
        board.setValue(selectSquare(), symbol);
    }

    const changeAccuarcy = (newAccuracy) => {
        accuarcy = newAccuracy;
    }

    return Object.assign({}, prototype, {placeSymbol, changeAccuarcy});
}

// game controller
const gameController = (() => {
    const playerX = Player('X', 'X');
    let playerO;
    let twoPlayers = document.getElementById('num-players').checked;

    if (twoPlayers) {
         playerO = Player('O', 'O');
    } else {
         playerO = AI('O', 'O', playerX, 0.25);
    }
    
    let currentPlayer = playerX;
    const board = gameBoard.getValues();
    let message = '';

    // check if game board is full
    const checkFull = (board) => !(board.includes(''));

    // check for 3 in a row in columns
    const checkCols = (board) => {
        for (let i = 0; i < 3; i++) {
            if (board[i] === board[i + 3] && board[i] === board[i + 6] && board[i] !== '') {
                return board[i];
            }
        }
        return false;
    }

    // check for 3 in a row in rows
    const checkRows = (board) => {
        for (let i = 0; i < 7; i+=3) {
            if (board[i] === board[i + 1] && board[i] === board[i + 2] && board[i] !== '') {
                return board[i];
            }
        }
        return false;
    }

    // chekc for 3 in a row in diagonals
    const checkDiagonals = (board) => {
        if (board[0] == board[4] && board[0] == board[8] && board[0] !== '') {
            return true, board[0];
        } else if (board[2] == board[4] && board[2] == board[6] && board[2] !== '') {
            return board[2];
        } else {
            return false;
        }
    }

    // check for winner
    const getWinnerSymbol = (board) => {
        if (checkRows(board)) {
            return checkRows(board);
        } else if (checkCols(board)) {
            return checkCols(board);
        } else if (checkDiagonals(board)) {
            return checkDiagonals(board);
        } else {
            return false;
        }
    }
    // check for game over
    const gameOver = () => {
        if (checkRows(board) || checkCols(board) || checkDiagonals(board)) {
            message = `${currentPlayer.getName()} Wins!`;
            return true;
        } else if (checkFull(board)) {
            message = 'Game Over. It is a Tie.';
            return true;
        } else {
            return false;
        }
    }

    const changePlayer = () => {
        if (currentPlayer.getSymbol() === 'X') {
            currentPlayer = playerO;
        } else {
            currentPlayer = playerX;
        }
    }

    const changeNumPlayers = (newValue) => {
        twoPlayers = newValue;
        if (twoPlayers) {
            playerO = Player('O', 'O');
       } else {
            playerO = AI('O', 'O', playerX, 0.25);
       }
    }

    const changeAIAccuarcy = (newAccuracy) => {
        switch(newAccuracy){
            case 'impossible':
                playerO.changeAccuarcy(1);
                break;
            case 'hard':
                playerO.changeAccuarcy(0.9);
                break;
            case 'medium':
                playerO.changeAccuarcy(0.6);
                break;
            default:
                playerO.changeAccuarcy(0.25);
        }
    }

    const playRound = () => {
        if (gameOver()) {
            displayController.displayWinner(message);
        } else {
            if (twoPlayers) {
                changePlayer();
            } else {
                changePlayer();
                playerO.placeSymbol();
                displayController.printBoard();
                if (gameOver()) {
                    displayController.displayWinner(message);
                }
                changePlayer();
            }
        }
        
    }

    const getCurrentPlayer = () => currentPlayer.getSymbol();

    return {
        gameOver,
        getCurrentPlayer,
        playRound,
        checkFull,
        getWinnerSymbol,
        changeAIAccuarcy,
        changeNumPlayers
    };
})();

// display controller
const displayController = (() => {
    const board = Array.from(document.querySelectorAll('.square'));
    const winner = document.getElementById('winner');
    const resetButton = document.getElementById('reset');
    const multiplayer = document.getElementById('num-players');
    const difficulty = document.getElementById('difficulty');
    const label = document.getElementById('difficulty-label');

    // clear HTML game board
    const reset = () => {
        resetButton.innerText = 'Reset';
        winner.innerText = '';
        gameBoard.clear();
        printBoard();
    }

    resetButton.addEventListener('click', reset);

    // change number of players
    multiplayer.addEventListener('change', function() {
        reset();
        gameController.changeNumPlayers(multiplayer.checked);
       if (multiplayer.checked) {
            difficulty.style.display = 'none';
            label.style.display = 'none';
       } else {
            difficulty.style.display = 'inline';
            label.style.display = 'inline';
       }
    });

    // change ai difficulty
    difficulty.addEventListener('change', function() {
        gameController.changeAIAccuarcy(difficulty.value);
        reset();
    });

    // display board in HTML
    const printBoard = () => {
        for (let i = 0; i < board.length; i++) {
            if (gameBoard.getValue() !== '') {
                board[i].innerText = gameBoard.getValue(i);
            }
        }
    }

    // display winning message
    const displayWinner = (message) => {
        winner.innerText = message;
        resetButton.innerText = 'Play Again';
    }

    // square mouse over, mouse out, and click events
    board.forEach(square => {
        square.addEventListener('mouseover', function() {
            if (gameBoard.isOpen(this.id) && !(gameController.gameOver())) {
                square.innerText = gameController.getCurrentPlayer();
                square.classList.add('selected');
            }
        });

        square.addEventListener('mouseout', function() {
            if (gameBoard.isOpen(this.id) && !(gameController.gameOver())) {
                square.innerText = '';
                square.classList.remove('selected')
            }
        });

        square.addEventListener('click', function(){
            if (gameBoard.isOpen(this.id) && !(gameController.gameOver())) {
                square.classList.remove('selected')
                gameBoard.setValue(this.id, gameController.getCurrentPlayer());
                printBoard();
                gameController.playRound();
            }
        });
    })

    return {
        printBoard,
        displayWinner,
        reset
    };

})();