const gameBoard = (() => {
    let board = new Array(9).fill('')
    
    const addSymbol = (symbol, location) => {
        if(board[location] = '') {
            board[location] = symbol;
        }
    }

    const getBoardAt = (index) => board[index];

    board[2] = 'X';
    board[8] = 'O'

    const clear = () => board.fill('');

    return { getBoardAt, clear, addSymbol };
})();

const player = (symbol, name) => {
    const placeSymbol = (position) => {
        console.log(position);
    }

    return { symbol, name };
}

function printBoard() {
    const board = document.getElementById('board');
    console.log(board.childElementCount);
    for (var i = 0; i < board.childElementCount; i++) {
        board.children[i].innerHTML = gameBoard.getBoardAt(i);
    }
}

printBoard();
