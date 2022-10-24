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

const Player = (symbol, name) => {

    return {symbol, name};
}

const gameController = (() => {
    let players = [Player('X', 'player1'), Player('O', 'player2')];
    let currentPlayer = players[0];

    const changePlayer = () => {
        if (currentPlayer === players[0]) {
            currentPlayer = players[1];
        } else {
            currentPlayer = players[0];
        }
    }
    
    const checkForGameOver = () => {
        if (gameBoard.boardFull()) {
            return true;
        } else if (gameBoard.checkCols() || gameBoard.checkRows() || gameBoard.checkDiagonals()) {
             return true;
        } else {
            return false;
        }
    }

    const getcurrentSymbol = () => {
       return currentPlayer.symbol;
    }

    return {

        changePlayer, 
        getcurrentSymbol, 
        checkForGameOver 
    };
})();

const displayController = (() => {
    const squares = document.querySelectorAll('.square');
    const reset = document.getElementById('reset');

    reset.addEventListener('click', () => {
        gameBoard.clear();
        squares.forEach(square => {
            square.innerHTML = '';
        })
    });

    squares.forEach(square => {
        square.addEventListener('click', function(){
            if (this.innerHTML === '')  {
                this.innerHTML = gameController.getcurrentSymbol();
                gameBoard.addSymbol(gameController.getcurrentSymbol(), Number(this.id));
                gameController.changePlayer();
                gameController.checkForGameOver();
            }
        })
    })
    return { };
})();
