import { useState } from "react";

function Square({ value, onClick, isInWinLine }) {
  const className = `text-5xl bg-white ${
    isInWinLine ? "text-black" : "text-red-600"
  } font-bold border border-black 
                flex items-center justify-center w-[6rem] aspect-square
                sm:w-[9rem] sm:text-6xl
                md:w-[10rem] md:text-7xl`;
  return (
    <button onClick={onClick} className={className}>
      {value}
    </button>
  );
}

function Board({ squares, xIsNext, onClick }) {
  function handleSquareClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    let newSquares = squares.slice();
    if (xIsNext) {
      newSquares[i] = "X";
    } else {
      newSquares[i] = "O";
    }
    onClick(newSquares, i);
  }

  const winObj = calculateWinner(squares);
  let winner, winLine;
  if (winObj) {
    [winner, winLine] = winObj;
  }
  let status;
  if (winner) {
    status = `${winner} is winner of the game`;
  } else {
    status = `Next player is ${xIsNext ? "X" : "O"}`;
  }

  let squareComps = squares.map((square, index) => {
    let isInWinLine = false;
    if (winLine) {
      isInWinLine = winLine.includes(index);
    }
    return (
      <Square
        key={index}
        value={square}
        isInWinLine={isInWinLine}
        onClick={() => handleSquareClick(index)}
      />
    );
  });

  return (
    <>
      <div className="mb-5 text-center text-3xl mt-10">{status}</div>
      <div className="grid grid-cols-3 w-[18rem] md:w-[30rem] sm:w-[27rem] mx-auto">
        {squareComps}
      </div>
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([[Array(9).fill(null), null]]);
  const [reverseHistoryOrder, setReverseHistoryOrder] = useState(false);
  const [curMove, setCurMove] = useState(0);
  const xIsNext = curMove % 2 == 0;
  const [currentSquares, lastClickedSquares] = history[history.length - 1];

  function handleBoardClick(newSquares, clickedSquare) {
    setHistory([...history, [newSquares, clickedSquare]]);
    setCurMove(curMove + 1);
  }

  function handleHistoryClick(i) {
    let newHistory = history.slice(0, i + 1);
    setHistory(newHistory);
    setCurMove(i);
  }

  function handleReverseHistoryOrderClick() {
    setReverseHistoryOrder(!reverseHistoryOrder);
  }

  let historyList = [];
  for (let index = 0; index < history.length; index++) {
    const [squares, clickedSquare] = history[index];
    let description = "Go back to start state";
    if (index != 0) {
      description = `Go back to state #${index} where was clicked at (${
        Math.floor(clickedSquare / 3) + 1
      }, ${clickedSquare % 3 + 1}) cell`;
    }
    if (index == history.length - 1) {
      description = `You're at move #${index}`;
    }
    historyList.push(
      <li
        className="hover:text-violet-700"
        key={index}
        onClick={() => handleHistoryClick(index)}
      >
        {description}
      </li>
    );
  }

  if (reverseHistoryOrder) {
    historyList = historyList.reverse();
  }

  return (
    <>
      <div className="lg:grid lg:grid-cols-2">
        <div>
          <Board
            squares={currentSquares}
            xIsNext={xIsNext}
            onClick={handleBoardClick}
          />
        </div>
        <div className="flex items-center flex-col">
          <h3 className="text-green-700 font-bold text-3xl mt-10">
            Game History
          </h3>
          <ol className="list-decimal cursor-pointer text-xl flex flex-col items-center mt-5">
            {historyList}
          </ol>
          <div className="flex gap-2 text-xl mt-5">
            <label htmlFor="reverse-order">Reverse order</label>
            <input
              className="w-5"
              type="checkbox"
              id="reverse-order"
              onClick={handleReverseHistoryOrderClick}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <div>
      <Game />
    </div>
  );
}

function calculateWinner(squares) {
  const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const winLine of winLines) {
    const [a, b, c] = winLine;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return [squares[a], winLine];
    }
  }
  return null;
}

export default App;
