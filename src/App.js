import React, { Component } from "react";
import "./styles.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends Component {
  renderSquare(i, j) {
    return (
      <Square
        key={i + "" + j}
        value={this.props.squares[i][j]}
        onClick={() => this.props.onClick(i, j)}
      />
    );
  }

  render() {
    let board = [];
    for (let i = 0; i < 3; ++i) {
      let res = [];
      for (let j = 0; j < 3; ++j) {
        res.push(this.renderSquare(i, j));
      }
      board.push(res);
    }
    return (
      <div>
        {board.map((row, i) => {
          return (
            <div key={i} className="board-row">
              {row.map((col, j) => col)}
            </div>
          );
        })}
      </div>
    );
  }
}

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(3).fill(Array(3).fill(null)),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = JSON.parse(JSON.stringify(current.squares));
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }
    squares[i][j] = "X";
    if (!calculateWinner(squares)) {
      let move = BestMove(squares);
      move ? (squares[move.i][move.j] = "O") : (move = null);
    }
    // squares[i][j] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  let winner = null;
  for (let i = 0; i < 3; i++) {
    if (
      squares[i][0] &&
      squares[i][0] === squares[i][1] &&
      squares[i][1] === squares[i][2]
    ) {
      winner = squares[i][0];
    }
  }
  for (let i = 0; i < 3; i++) {
    if (
      squares[0][i] &&
      squares[0][i] === squares[1][i] &&
      squares[1][i] === squares[2][i]
    ) {
      winner = squares[0][i];
    }
  }
  if (
    squares[0][0] &&
    squares[1][1] === squares[0][0] &&
    squares[1][1] === squares[2][2]
  ) {
    return squares[0][0];
  }
  if (
    squares[0][2] &&
    squares[1][1] === squares[0][2] &&
    squares[1][1] === squares[2][0]
  ) {
    winner = squares[0][2];
  }
  let spot = 0;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      if (!squares[i][j]) spot++;
    }
  if (spot === 0 && winner === null) return "draw";
  else return winner;
}
function BestMove(squares) {
  let bestScore = -1 / 0;
  let move;
  for (let i = 0; i < 3; ++i)
    for (let j = 0; j < 3; ++j) {
      if (!squares[i][j]) {
        squares[i][j] = "O";
        let score = Minimax(squares, true, 0);
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
        squares[i][j] = null;
      }
    }
  return move;
}
var scores = {
  X: -10,
  O: 10,
  draw: 0,
};

function Minimax(squares, xIsNext, depth) {
  let result = calculateWinner(squares);
  if (result !== null) {
    return scores[result];
  }
  if (!xIsNext) {
    let bestScore = -1 / 0;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) {
        if (!squares[i][j]) {
          squares[i][j] = "O";
          bestScore = Math.max(
            Minimax(squares, true, depth + 1) + 1,
            bestScore
          );
          squares[i][j] = null;
        }
      }
    return bestScore;
  }
  if (xIsNext) {
    let bestScore = 1 / 0;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) {
        if (!squares[i][j]) {
          squares[i][j] = "X";
          bestScore = Math.min(Minimax(squares, false, depth + 1), bestScore);
          squares[i][j] = null;
        }
      }
    return bestScore;
  }
}
