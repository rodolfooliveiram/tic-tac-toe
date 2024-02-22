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

    onPlay(nextSquares, i);
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

function RestartButton({ onRestartGame }) {
  return (
    <button className='restart' onClick={onRestartGame}>
      Restart Game
    </button>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isToggleActive, setIsToggleActive] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [movesLocationHistory, setMovesLocationHistory] = useState([
    Array(2).fill(null),
  ]);

  function handlePlay(nextSquares, moveIndex) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    calculateMoveLocation(moveIndex);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleToggleClick() {
    setIsToggleActive(!isToggleActive);
  }

  function handleRestartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setIsToggleActive(false);
    setMovesLocationHistory([Array(2).fill(null)]);
  }

  function calculateMoveLocation(currentMoveIndex) {
    let row, col;

    if (currentMoveIndex <= 2) {
      row = 1;
    } else if (currentMoveIndex > 2 && currentMoveIndex <= 5) {
      row = 2;
    } else {
      row = 3;
    }

    switch (currentMoveIndex) {
      case 0:
      case 3:
      case 6:
        col = 1;
        break;
      case 1:
      case 4:
      case 7:
        col = 2;
        break;
      case 2:
      case 5:
      case 8:
        col = 3;
        break;
    }

    const nextLocationHistory = [...movesLocationHistory, [row, col]];
    setMovesLocationHistory(nextLocationHistory);
  }

  const moves = history.map((_, move) => {
    let description;

    if (isToggleActive) {
      move = history.length - move - 1;
    }

    if (move > 0 && move < history.length - 1) {
      description =
        'Go to move #' +
        move +
        ' (' +
        movesLocationHistory[move][0] +
        ', ' +
        movesLocationHistory[move][1] +
        ')';
    } else if (move === history.length - 1 && move > 0) {
      description =
        'You are at move #' +
        move +
        ' (' +
        movesLocationHistory[move][0] +
        ', ' +
        movesLocationHistory[move][1] +
        ')';
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
        <RestartButton onRestartGame={() => handleRestartGame()} />
      </div>
      <div className='game-info'>
        <div className='moves-history'>Moves' History</div>
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
