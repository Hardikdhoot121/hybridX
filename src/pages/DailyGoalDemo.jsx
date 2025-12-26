import React, { useState } from 'react';
import DailyGoalProgress from '../components/DailyGoalProgress';

const DailyGoalDemo = () => {
  const [correct, setCorrect] = useState(2);
  const [incorrect, setIncorrect] = useState(5);
  const dailyGoal = 15;

  const handleAddCorrect = () => {
    setCorrect(prev => Math.min(prev + 1, dailyGoal));
  };

  const handleAddIncorrect = () => {
    setIncorrect(prev => Math.min(prev + 1, dailyGoal - correct));
  };

  const handleReset = () => {
    setCorrect(2);
    setIncorrect(5);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Daily Goal Progress Demo</h1>
      
      <div className="mb-8">
        <DailyGoalProgress 
          dailyGoal={dailyGoal}
          correct={correct}
          incorrect={incorrect}
        />
      </div>
      
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">Controls</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Correct Answers:</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCorrect(prev => Math.max(0, prev - 1))}
                className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                disabled={correct <= 0}
              >
                -
              </button>
              <span className="w-8 text-center text-white">{correct}</span>
              <button 
                onClick={handleAddCorrect}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
                disabled={correct + incorrect >= dailyGoal}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Incorrect Answers:</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIncorrect(prev => Math.max(0, prev - 1))}
                className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                disabled={incorrect <= 0}
              >
                -
              </button>
              <span className="w-8 text-center text-white">{incorrect}</span>
              <button 
                onClick={handleAddIncorrect}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
                disabled={correct + incorrect >= dailyGoal}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <button 
              onClick={handleReset}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Try adding correct/incorrect answers to see the progress update.</p>
        <p>When you reach the daily goal (15 attempts), the circle will start glowing!</p>
      </div>
    </div>
  );
};

export default DailyGoalDemo;
