import { useState } from 'react';
import { render } from 'react-dom';

function Square({ value, onSquareClick }) {
  return (
    <button className='square' onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardSize = 3;

  const renderSquare = (index) => (
    <Square value={squares[index]} onSquareClick={() => handleClick(index)} />
  );

  const renderBoardRow = (rowIndex) => (
    <div className='board-row' key={rowIndex}>
      {Array.from({ length: boardSize }, (_, colIndex) =>
        renderSquare(rowIndex * boardSize + colIndex)
      )}
    </div>
  );

  const renderBoard = Array.from({ length: boardSize }, (_, rowIndex) =>
    renderBoardRow(rowIndex)
  );

  return (
    <>
      <div className='status'>{status}</div>

      {renderBoard.map((boardRow) => {
        return boardRow;
      })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0 && move < history.length - 1) {
      description = 'Go to move #' + move;
    } else if (move === history.length - 1 && move !== 0) {
      description = 'You are at move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        {move === history.length - 1 && move > 0 ? (
          description
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <div>Moves' History</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
