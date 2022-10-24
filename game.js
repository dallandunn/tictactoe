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

    return {symbol};
}

const gameController = (() => {
    const currentPlayer = Player('X', 'player1');

    return {currentPlayer};
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
                this.innerHTML = gameController.currentPlayer.symbol;
                gameBoard.addSymbol(gameController.currentPlayer.symbol, Number(this.id));
            }
        })
    })
    return { printBoard };
})();
