import { useState } from 'react';

function Square({ squareIndex, winnerSquaresIndexes, value, onSquareClick }) {
  return (
    <button
      className={
        squareIndex == winnerSquaresIndexes[0] ||
        squareIndex == winnerSquaresIndexes[1] ||
        squareIndex == winnerSquaresIndexes[2]
          ? 'square winner'
          : 'square'
      }
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (winner || squares[i]) {
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

  const { winner, winnerSquares } = calculateWinner(squares);
  let status;

  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.includes(null)) {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  } else {
    status = 'Draw';
  }

  const boardSize = 3;

  const renderSquare = (index) => (
    <Square
      key={index}
      squareIndex={index}
      winnerSquaresIndexes={winnerSquares}
      value={squares[index]}
      onSquareClick={() => handleClick(index)}
    />
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

function ToggleButton({ isToggleActive, onToggleClick }) {
  return (
    <button onClick={onToggleClick}>
      {isToggleActive ? 'Older moves' : 'Most recent moves'}
    </button>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isToggleActive, setIsToggleActive] = useState(false);
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

  function handleToggleClick() {
    setIsToggleActive(!isToggleActive);
  }

  const moves = history.map((_, move) => {
    let description;

    if (isToggleActive) {
      move = history.length - move - 1;
    }

    if (move > 0 && move < history.length - 1) {
      description = 'Go to move #' + move;
    } else if (move === history.length - 1 && move > 0) {
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
        <div>
          <span>Sort: </span>
          <ToggleButton
            isToggleActive={isToggleActive}
            onToggleClick={() => handleToggleClick()}
          />
        </div>
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

  let winnerSquares = [];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winnerSquares.push(a, b, c);
      return { winner: squares[a], winnerSquares };
    }
  }

  return { winner: null, winnerSquares };
}
