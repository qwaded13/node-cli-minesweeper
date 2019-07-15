const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

readline.emitKeypressEvents(process.stdin);

process.stdin.on('keypress', (str, key) => {
  if (key.name === 'x') {
    process.exit();
  }
});

class Game {
  constructor(size) {
    this.relationalIndices = [
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1]
    ];
    // initialize the backend board array - start at 10x10 to begin
    this.mineBoard = this.generateMineBoard();
    this.viewBoard = this.generateViewBoard();
    this.gameOver = false;
  }

  getNextMove(rl) {
    this.printBoardView();
    rl.question('What row would you like to check?\n', (answerRow) => {
      rl.question('What column would you like to check?\n', (answerCol) => {
        let row = Number(answerRow);
        let col = Number(answerCol);
        this.reveal(row, col);
        this.getNextMove(rl);
      });
    });
  }

  reveal(x, y) {
    if (this.mineBoard[x][y] === 'X') {
      console.log('You hit a bomb! Sorry, you lose :(');
      process.exit();
    } else if (this.mineBoard[x][y] !== '0') {
      this.viewBoard[x][y] = this.mineBoard[x][y];
    } else if (this.mineBoard[x][y] === '0') {
      this.viewBoard[x][y] = this.mineBoard[x][y];
      this.relationalIndices.forEach((pair) => {
        let checkRow = x + pair[0];
        let checkCol = y + pair[1];
        if (
          checkRow < 0 ||
          checkRow > 9 ||
          checkCol < 0 ||
          checkCol > 9 ||
          this.viewBoard[checkRow][checkCol] !== '#'
        ) {
          return;
        }
        this.reveal(checkRow, checkCol);
      });
    }
  }

  printBoardView() {
    console.log(this.viewBoard);
  }

  generateMineBoard() {
    let mineBoard = Array(10)
      .fill(null)
      .map((row) => Array(10).fill(null));

    for (let i = 0; i < 10; i++) {
      let row = Math.floor(Math.random() * 10);
      let col = Math.floor(Math.random() * 10);
      if (mineBoard[row][col] === null) {
        mineBoard[row][col] = 'X';
      } else {
        i--;
      }
    }

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        let cell = mineBoard[row][col];

        if (cell === 'X') {
          continue;
        }

        let bombCount = 0;

        this.relationalIndices.forEach((pair) => {
          let checkRow = row + pair[0];
          let checkCol = col + pair[1];

          if (checkRow < 0 || checkRow > 9 || checkCol < 0 || checkCol > 9) {
            return;
          }

          if (mineBoard[checkRow][checkCol] === 'X') {
            bombCount++;
          }
        });

        mineBoard[row][col] = bombCount.toString();
      }
    }

    return mineBoard;
  }

  generateViewBoard() {
    return Array(10)
      .fill(null)
      .map((row) => Array(10).fill('#'));
  }
}

function startGame(rl) {
  let game = new Game();
  game.getNextMove(rl);
}

startGame(rl);
