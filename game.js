const gameBoard = (() => {
    let board = new Array(9).fill('')
    
    const addSymbol = (symbol, location) => {
        if(board[location] === '') {
            board[location] = symbol;
        }
    }

    const boardAtIndex = (index) => board[index];

    const clear = () => board.fill('');


    return { board, boardAtIndex, clear, addSymbol };
})();

const Player = (symbol, name) => {

    return {symbol, name};
}

const gameController = (() => {
    let players = [Player('X', 'player1'), Player('O', 'player2')];
    let currentPlayer = players[0];
    let gameOver = false;

    const changePlayer = () => {
        if (currentPlayer === players[0]) {
            currentPlayer = players[1];
        } else {
            currentPlayer = players[0];
        }
        console.log(currentPlayer.symbol);
    }

    const getcurrentSymbol = () => {
       return currentPlayer.symbol;
    }

    return {currentPlayer, changePlayer, getcurrentSymbol};
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
                console.log(gameController.changePlayer.symbol);
                gameBoard.addSymbol(gameController.getcurrentSymbol(), Number(this.id));
                gameController.changePlayer();
            }
        })
    })
    return { };
})();
