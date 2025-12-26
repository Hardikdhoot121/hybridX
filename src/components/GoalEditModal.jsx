import React from 'react';
import { X } from 'lucide-react';

const GoalEditModal = ({ isOpen, onClose, currentGoal, onSave }) => {
  const [tempGoal, setTempGoal] = React.useState(currentGoal || 15);

  React.useEffect(() => {
    setTempGoal(currentGoal || 15);
  }, [currentGoal, isOpen]);

  const handleSave = () => {
    const newGoal = tempGoal > 0 ? tempGoal : 1;
    onSave(newGoal);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl p-6 shadow-lg border border-white/5 relative overflow-hidden w-[400px]">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-xl blur opacity-20"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Edit Daily Goal</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Daily Question Goal
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={tempGoal}
                onChange={(e) => setTempGoal(parseInt(e.target.value) || 0)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#1E293B] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                placeholder="Enter goal (1-100)"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Set your daily target for question attempts
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-[#1E293B] text-gray-400 hover:text-white hover:bg-[#2D3748] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 pill-button"
            >
              Save Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalEditModal;
