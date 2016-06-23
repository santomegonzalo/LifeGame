'use strict';

//game rules https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life

const GameLife = function( canvas, countRow, countColumn, cellSize, prefilledCells ) {
    this.canvas = canvas;
    
    this.emptyCells = true;
    this.isRunning = false;
    this.eventsDefined = false;

    this.cellSize = cellSize;
    this.countRow = countRow;
    this.countColumn = countColumn;

    this._defineBoard();
    
    this.prefilledCells = prefilledCells;
    this.cells = [];
    this.aliveCells = []; //this is just for testing

    this.interval = null;
};

GameLife.prototype.changeCellSize = function( cellSize ) {
    this.cellSize = cellSize;
    this._defineBoard();
    this._draw();
};

GameLife.prototype.changeColumns = function( columns ) {
    this.countColumn = columns;
    this._defineBoard();
    this._draw();
};

GameLife.prototype.changeRows = function( rows ) {
    this.countRow = rows;
    this._defineBoard();
    this._draw();
};

GameLife.prototype.stop = function() {
    if( this.interval !== null ) {
        clearInterval(this.interval);
    }

    this.isRunning = false;
};

GameLife.prototype.clear = function( redraw ) {
    this.emptyCells = true;
    this.cells = [];

    for( let x = 0; x < this.countRow; x++ ) {
        this.cells[x] = [];
        for( let y = 0; y < this.countColumn; y++ ) {
            this.cells[x][y] = 'dead';
        }
    }

    if( redraw === true ) {
        this._draw();
    }

    this._defineListeners();
};

GameLife.prototype.start = function( speed ) {
    this.isRunning = true;
    
    //if the user didn't click the canvas I'm starting a default
    if( this.emptyCells ) {
        let liveCells = [
            {column: 0, row: 1},
            {column: 1, row: 2},
            {column: 1, row: 3},
            {column: 1, row: 4},
            {column: 3, row: 5},
            {column: 3, row: 6},
            {column: 3, row: 7},
            {column: 3, row: 8},
            {column: 4, row: 5},
            {column: 4, row: 6},
            {column: 4, row: 7},
            {column: 4, row: 8},
            {column: 10, row: 3},
            {column: 10, row: 2},
            {column: 11, row: 3},
            {column: 11, row: 2},
            {column: 12, row: 3},
            {column: 12, row: 2},
            {column: 13, row: 3},
            {column: 13, row: 2},
            {column: 14, row: 3},
            {column: 14, row: 2},
            {column: 15, row: 3},
            {column: 15, row: 2},
            {column: 10, row: 5},
            {column: 10, row: 6},
            {column: 11, row: 7},
            {column: 11, row: 6},
            {column: 12, row: 5},
            {column: 12, row: 6},
            {column: 15, row: 1},
            {column: 15, row: 6},
            {column: 10, row: 10},
            {column: 10, row: 9},
        ];

        this.defineAliveCells(liveCells);
    }

    speed = speed === undefined ? 500 : speed;

    this.interval = setInterval(() => {
        this.nextStep();
    }, speed);
};

GameLife.prototype.init = function() {
    this.clear();

    //transforms the default cells into the live cells
    this.defineAliveCells(this.prefilledCells);

    return this;
};

GameLife.prototype.defineAliveCells = function( cells ) {
    this.clear();

    cells.forEach((points) => {
        this.cells[points.column][points.row] = 'alive';
        this.aliveCells.push(points);
    });

    this._draw();
};

GameLife.prototype.nextStep = function() {
    let nextCells = [];
    //clean the alive cells (just for testing);
    this.aliveCells = [];

    this.cells.forEach((row, x) => {
        nextCells[x] = [];

        row.forEach((state, y) => {
            const aliveNeighbours = this._countNeighbours(x, y);
            let newState = this.cells[x][y];

            if( state === 'alive' ) {
                //dead by overpopulation or underpopulation
                if( aliveNeighbours < 2 || aliveNeighbours > 3 ) {
                    newState = 'dead';
                }
                //lives on next
                else if( aliveNeighbours === 2 || aliveNeighbours === 3 ) {
                    newState = 'alive';
                    this.aliveCells.push({column: x, row: y});
                }
            }
            else {
                //reproduction
                if( aliveNeighbours === 3 ) {
                    newState = 'alive';
                    this.aliveCells.push({column: x, row: y});
                }
            }

            nextCells[x][y] = newState;
        });
    });

    this.cells = nextCells;

    this._draw();
};

GameLife.prototype.getCells = function() {
    return {
        all: this.cells,
        alive: this.aliveCells
    };
};

/*
PRIVATE FUNCTIONS
*/
GameLife.prototype._draw = function() {
    if( this.board ) {
        this.board.clearRect(0, 0, this.boardWidth, this.boardHeight);

        this.cells.forEach(( row, x ) => {
            row.forEach(( state, y ) => {
                this.board.beginPath();
                this.board.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                if( state === 'alive' ) {
                    this.board.fill();
                }
                else {
                    this.board.stroke();
                }
            });
        });
    }
};

GameLife.prototype._countNeighbours = function( row, column ) {
    const isAlive = (_row, _column) => {
        return this.cells[_row] && this.cells[_row][_column] === 'alive';
    };

    let count = 0;

    if( isAlive(row - 1, column - 1) ) count++;
    if( isAlive(row,   column - 1) ) count++;
    if( isAlive(row + 1, column - 1) ) count++;
    if( isAlive(row - 1, column ) ) count++;
    if( isAlive(row + 1, column ) ) count++;
    if( isAlive(row - 1, column + 1) ) count++;
    if( isAlive(row, column + 1) ) count++;
    if( isAlive(row + 1, column + 1) ) count++;

    return count;
};

GameLife.prototype._defineBoard = function() {
    this.boardWidth = this.countRow * this.cellSize;
    this.boardHeight = this.countColumn * this.cellSize;

    if( this.canvas ) {
        this.canvas.width = this.boardWidth;
        this.canvas.height = this.boardHeight;
        this.board = this.canvas.getContext('2d');
        this.board.strokeStyle = '#d8d8d8';
        this.board.fillStyle = '#818bd4';
    }
};

GameLife.prototype._clickEvent = function( e ) {
    if( this.isRunning ) {
        return;
    }

    const selectedColumn = Math.floor(e.offsetX / this.cellSize);
    const selectedRow = Math.floor(e.offsetY / this.cellSize);

    this.emptyCells = false;
    this.aliveCells.push({column: selectedColumn, row: selectedRow});
    this.cells[selectedColumn][selectedRow] = 'alive';
    this._draw();
};

GameLife.prototype._defineListeners = function() {

    if( this.canvas && !this.eventsDefined ) {
        this.eventsDefined = true;
        this.canvas.addEventListener('click', this._clickEvent.bind(this));
    }
};

//just for testing purpose
if( typeof module !== 'undefined' ) {
    module.exports = GameLife;
}
