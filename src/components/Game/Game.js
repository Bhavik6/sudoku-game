import React, { useState } from 'react';
import SudokuBoard from '../SudokuBoard/SudokuBoard';
import sudoku from '../../assets/sudoku.png';

const Game = () => {
  const [difficulty, setDifficulty] = useState('easy');

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mb-16">
      <div>
        <img src={sudoku} alt='sudoku logo' className='w-96 h-32'/>
      </div>
      <div className="mb-4">
        <label htmlFor="difficulty" className="mr-2">Select Difficulty:</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
          className="select select-bordered max-w-xs"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <SudokuBoard difficulty={difficulty} />
    </div>
  );
};

export default Game;
