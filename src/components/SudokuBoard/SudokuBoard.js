import React, { useState, useEffect } from 'react';
import sudoku from 'sudoku';
import happy from '../../assets/happy.gif';
import sad from '../../assets/sad.gif';

const SudokuBoard = ({ difficulty }) => {
  const [board, setBoard] = useState(generateBoard(difficulty));
  const [isValid, setIsValid] = useState(true);
  const [invalidCells, setInvalidCells] = useState([]);
  const [nonNumericCells, setNonNumericCells] = useState([]);

  useEffect(() => {
    setBoard(generateBoard(difficulty));
  }, [difficulty]);

  useEffect(() => {
    const { valid, invalidCells } = validateBoard(board);
    setIsValid(valid && nonNumericCells.length === 0);
    setInvalidCells(invalidCells);
  }, [board, nonNumericCells]);

  const handleChange = (row, col, value) => {
    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col
          ? { ...cell, value }
          : cell
      )
    );
    setBoard(newBoard);

    const nonNumeric = [];
    newBoard.forEach((r, rowIndex) => {
      r.forEach((cell, colIndex) => {
        if (cell.value && !/^[1-9]$/.test(cell.value)) {
          nonNumeric.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    setNonNumericCells(nonNumeric);
  };

  const isInvalidCell = (rowIndex, colIndex) => {
    return invalidCells.some(cell => cell.row === rowIndex && cell.col === colIndex);
  };

  const isNonNumericCell = (rowIndex, colIndex) => {
    return nonNumericCells.some(cell => cell.row === rowIndex && cell.col === colIndex);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-9 gap-1 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-gray-100 shadow-md rounded-lg p-2">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              maxLength="1"
              value={cell.value}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              className={"w-10 h-10 text-center border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded text-slate-950 " + (isInvalidCell(rowIndex, colIndex) ? 'bg-red-200' : '') + (isNonNumericCell(rowIndex, colIndex) ? 'bg-yellow-200' : '')}
              disabled={cell.isPreFilled}
            />
          ))
        )}
      </div>
      <div className="mt-4 mb-4">
        {isValid ? (
          <span className="flex flex-inline items-center text-green-500">Board is valid 
             <img src={happy} alt="Happy GIF" className='h-6 w-6 bg-gray-100' />
          </span>
        ) : (
          <span className="flex flex-inline items-center text-red-500">Board is invalid
            <img src={sad} alt="Sad GIF" className='h-6 w-6 bg-gray-100' />
          </span>
        )}
      </div>
    </div>
  );
};

const generateBoard = (difficulty) => {
  const difficultyLevels = {
    easy: 62,
    medium: 53,
    hard: 44,
  };

  const puzzle = sudoku.makepuzzle();
  const solution = sudoku.solvepuzzle(puzzle);

  const numberOfCellsToFill = difficultyLevels[difficulty];
  const filledPuzzle = puzzle.map((cell, index) => {
    if (cell !== null && Math.random() * 81 <= numberOfCellsToFill) {
      return solution[index];
    }
    return null;
  });

  return formatBoard(filledPuzzle);
};

const formatBoard = (puzzle) => {
  const board = [];
  for (let i = 0; i < 9; i++) {
    const row = [];
    for (let j = 0; j < 9; j++) {
      row.push({
        value: puzzle[i * 9 + j] !== null ? (puzzle[i * 9 + j] + 1).toString() : '',
        isPreFilled: puzzle[i * 9 + j] !== null
      });
    }
    board.push(row);
  }
  return board;
};

const validateBoard = (board) => {
  const invalidCells = [];

  const isValidArray = (arr) => {
    const values = arr.filter(cell => cell.value !== '').map(cell => cell.value);
    return new Set(values).size === values.length;
  };

  // Check rows
  for (let i = 0; i < 9; i++) {
    if (!isValidArray(board[i])) {
      board[i].forEach((cell, colIndex) => {
        if (cell.value !== '' && board[i].filter(c => c.value === cell.value).length > 1) {
          invalidCells.push({ row: i, col: colIndex });
        }
      });
    }
  }

  // Check columns
  for (let i = 0; i < 9; i++) {
    const col = board.map(row => row[i]);
    if (!isValidArray(col)) {
      col.forEach((cell, rowIndex) => {
        if (cell.value !== '' && col.filter(c => c.value === cell.value).length > 1) {
          invalidCells.push({ row: rowIndex, col: i });
        }
      });
    }
  }

  // Check 3x3 subgrids
  for (let row = 0; row < 9; row += 3) {
    for (let col = 0; col < 9; col += 3) {
      const subgrid = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          subgrid.push(board[row + i][col + j]);
        }
      }
      if (!isValidArray(subgrid)) {
        subgrid.forEach((cell, index) => {
          if (cell.value !== '' && subgrid.filter(c => c.value === cell.value).length > 1) {
            const subgridRow = row + Math.floor(index / 3);
            const subgridCol = col + (index % 3);
            invalidCells.push({ row: subgridRow, col: subgridCol });
          }
        });
      }
    }
  }

  return { valid: (invalidCells.length === 0), invalidCells };
};

export default SudokuBoard;
