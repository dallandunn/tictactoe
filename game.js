const gameBoard = (() => {
    let board = new Array(9).fill('')
    
    const addSymbol = (symbol, location) => {
        if(board[location] === '') {
            board[location] = symbol;
        }
    }

    const boardAtIndex = (index) => board[index];

    const boardFull = () => !(board.includes(''));

    const clear = () => board.fill('');

    const checkCols = () => {
        let threeInARow = false;
        for (let i = 0; i < 3; i++) {
            if (board[i] === board[i + 3] && board[i] === board[i + 6] && board[i] !== '') {
                threeInARow = true;
            } 
        }
        return threeInARow;
    }

    const checkRows = () => {
        let threeInARow = false;
        for (let i = 0; i < 7; i+=3) {
            if (board[i] === board[i + 1] && board[i] === board[i + 2] && board[i] !== '') {
                threeInARow = true;
            }
        }
        return threeInARow;
    }

    const checkDiagonals = () => {
        let threeInARow = false
        if (board[0] == board[4] && board[0] == board[8] && board[0] !== '') {
            threeInARow = true;
        } else if (board[2] == board[4] && board[2] == board[6] && board[2] !== '') {
            threeInARow = true;
        }
        return threeInARow;
    }


    return { 
        board, 
        boardAtIndex, 
        clear, 
        addSymbol, 
        boardFull, 
        checkCols, 
        checkRows, 
        checkDiagonals 
    };
})();

const Player = (symbol, name, playerType) => {

    const placeSymbol = (index) => {
        gameBoard.addSymbol(symbol, index);
    }

    const getSymbol = () => symbol;

    const getName = () => name;

    return {getSymbol, getName, placeSymbol};
}

const AI = (symbol, name, difficulty) => {
    const {getName} = Player(symbol, name);
    const {getSymbol} = Player(symbol, name);

    const placeSymbol = () => {
        if (!(gameController.checkForGameOver())) {
            return ''
        }
        const square = selectSquare(difficulty);
        gameBoard.addSymbol(symbol, square);
        document.getElementById(square.toString()).innerText = symbol;
    }

    const selectSquare = (difficulty) => {
        let selection;
        if (difficulty === 'easy') {
            do {
                selection = Math.floor(Math.random()  *  10);
            } while (gameBoard.boardAtIndex(selection) !== '');
        }
        
        return selection;
    }

    return {placeSymbol, getName, getSymbol};
}

const gameController = (() => {
    // let players = [Player('X', document.getElementById('x').value), Player('O', document.getElementById('o').value)];
    let players = [Player('X', document.getElementById('x').value), AI('O', 'AI', 'easy')]
    let currentPlayer = players[0];

    const changePlayer = () => {
        if (currentPlayer === players[0]) {
            currentPlayer = players[1];
        } else {
            currentPlayer = players[0];
        }
    }
    
    const checkForGameOver = () => {
        if (gameBoard.checkCols() || gameBoard.checkRows() || gameBoard.checkDiagonals()) {
            displayController.displayWinner(currentPlayer.getName() + ' is the Winner!');
            currentPlayer = players[0];
            return false;
        } else if (gameBoard.boardFull()) {
            displayController.displayWinner("Game Over. It's a tie.");
            currentPlayer = players[0];
            return false;
        } else {
            return true;
        }
    }

    const getCurrentPlayer = () => {
       return currentPlayer;
    }

    const getPlayers = () => players;

    return {
        changePlayer, 
        getCurrentPlayer, 
        checkForGameOver,
        getPlayers
    };
})();

const displayController = (() => {
    const squares = document.querySelectorAll('.square');
    const reset = document.getElementById('reset');
    const winner = document.getElementById('winner');

    const displayWinner = (message) => {
        winner.innerText = message;
        reset.innerText = 'Play Again'
    }

    reset.addEventListener('click', () => {
        gameBoard.clear();
        displayWinner(' ');
        reset.innerHTML = 'Reset'
        squares.forEach(square => {
            square.innerHTML = '';
        })
    });

    squares.forEach(square => {
        square.addEventListener('click', function(){
            if (this.innerHTML === '' && gameController.checkForGameOver())  {
                this.innerHTML = gameController.getCurrentPlayer().getSymbol();
                
                gameController.getCurrentPlayer().placeSymbol(Number(this.id));
                gameController.checkForGameOver();
                gameController.getPlayers()[1].placeSymbol();
                // gameController.changePlayer();
            }
        })
    })
    return {
        displayWinner
    };
})();