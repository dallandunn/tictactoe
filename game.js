// game board
const gameBoard = (() => {
    let values = new Array(9).fill('');

    const getValue = (index) => {
        return values[index];
    }

    const setValue = (index, newValue) => {
        if (!(gameController.gameOver()) && values[index] === '') {
            values[index] = newValue;
        }
        
    }

    const clear = () => values.fill('');

    const getValues = () => values;

    return {
        getValue,
        setValue,
        getValues,
        clear
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
const AI = (name, symbol, difficulty) => {
    const prototype = Player(name, symbol);

    const selectSquare = () => {
        let selection;
        if (difficulty === 'easy') {
        // randomly select a space on the board
            do {
                selection = Math.floor(Math.random()  *  10);
            } while (gameBoard.getValue(selection) !== '');
        }
        return selection;
    }

    const placeSymbol = () => {
        gameBoard.setValue(selectSquare(), symbol);
        displayController.printBoard();
    }

    return Object.assign({}, prototype, {placeSymbol});
}

// game controller
const gameController = (() => {
    const playerX = Player(document.getElementById('x').value, 'X');
    const playerO = AI(document.getElementById('o').value, 'O', 'easy');
    let currentPlayer = playerX;
    const board = gameBoard.getValues();
    let message = '';

    // check if game board is full
    const checkFull = () => !(board.includes(''));

    // check for 3 in a row in columns
    const checkCols = () => {
        for (let i = 0; i < 3; i++) {
            if (board[i] === board[i + 3] && board[i] === board[i + 6] && board[i] !== '') {
                return true;
            }
        }
        return false;
    }

    // check for 3 in a row in rows
    const checkRows = () => {
        for (let i = 0; i < 7; i+=3) {
            if (board[i] === board[i + 1] && board[i] === board[i + 2] && board[i] !== '') {
                return true;
            }
        }
        return false;
    }

    // chekc for 3 in a row in diagonals
    const checkDiagonals = () => {
        if (board[0] == board[4] && board[0] == board[8] && board[0] !== '') {
            return true;
        } else if (board[2] == board[4] && board[2] == board[6] && board[2] !== '') {
            return true;
        } else {
            return false;
        }
    }

    // check for game over
    const gameOver = () => {
        if (checkRows() || checkCols() || checkDiagonals()) {
            message = `${currentPlayer.getName()} Wins!`;
            return true;
        } else if (checkFull()) {
            message = 'Game Over. It is a Tie.'
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

    const playRound = () => {
        if (gameOver()) {
            displayController.displayWinner(message);
        } else {
            // changePlayer();
            playerO.placeSymbol();
        }
        
    }

    const getCurrentPlayer = () => currentPlayer.getSymbol();

    return {
        gameOver,
        getCurrentPlayer,
        playRound
    };
})();

// display controller
const displayController = (() => {
    const board = Array.from(document.querySelectorAll('.square'));
    const winner = document.getElementById('winner');
    const resetButton = document.getElementById('reset');

    // clear HTML game board
    const reset = () => {
        resetButton.innerText = 'Reset';
        winner.innerText = '';
        gameBoard.clear();
        printBoard();
    }

    resetButton.addEventListener('click', reset);

    // display board in HTML
    const printBoard = () => {
        for (let i = 0; i < board.length; i++) {
            if (gameBoard.getValue() !== '') {
                board[i].innerText = gameBoard.getValue(i);
            }
        }
    }

    const displayWinner = (message) => {
        winner.innerText = message;
        resetButton.innerText = 'Play Again';
    }

    board.forEach(square => {
        square.addEventListener('click', function(){
            gameBoard.setValue(this.id, gameController.getCurrentPlayer());
            gameController.playRound();
            printBoard();
        })
    })

    return {
        printBoard,
        displayWinner
    };

})();