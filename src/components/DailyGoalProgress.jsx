import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Check, X } from 'lucide-react';
import GoalEditModal from './GoalEditModal';

const DailyGoalProgress = ({ dailyGoal: initialDailyGoal = 15, correct = 2, incorrect = 5, onGoalChange }) => {
  const [progress, setProgress] = useState({ correct, incorrect });
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(initialDailyGoal);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [glow, setGlow] = useState(false);
  const inputRef = useRef(null);
  const prevProgressRef = useRef({ correct, incorrect });
  const flashTimerRef = useRef(null);
  const [flashArc, setFlashArc] = useState(null);
  const [flashKey, setFlashKey] = useState(0);
  
  // Update progress when props change
  useEffect(() => {
    setProgress({ correct, incorrect });
    
    // Trigger glow effect when goal is completed
    if (correct + incorrect >= initialDailyGoal) {
      setGlow(true);
    } else {
      setGlow(false);
    }
  }, [correct, incorrect, initialDailyGoal]);

  useEffect(() => {
    const prev = prevProgressRef.current;
    let nextFlash = null;
    if (correct > prev.correct) nextFlash = 'green';
    if (incorrect > prev.incorrect) nextFlash = 'red';

    prevProgressRef.current = { correct, incorrect };
    if (!nextFlash) return;

    setFlashArc(nextFlash);
    setFlashKey((k) => k + 1);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setFlashArc(null), 650);

    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, [correct, incorrect]);
  
  // Focus the input when editing starts
  useEffect(() => {
    if (editingGoal && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingGoal]);
  
  const handleGoalChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
    setTempGoal(value ? parseInt(value, 10) : '');
  };
  
  const handleSaveGoal = () => {
    const newGoal = tempGoal > 0 ? tempGoal : 1; // Ensure at least 1
    if (onGoalChange) {
      onGoalChange(newGoal);
    }
    setEditingGoal(false);
  };

  const handleModalSave = (newGoal) => {
    if (onGoalChange) {
      onGoalChange(newGoal);
    }
    setTempGoal(newGoal);
  };
  
  const handleCancelEdit = () => {
    setTempGoal(initialDailyGoal);
    setEditingGoal(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveGoal();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };
  
  // Animation variants for the glow effect
  const glowVariant = {
    initial: { filter: 'drop-shadow(0 0 0px rgba(74, 222, 128, 0)) drop-shadow(0 0 0px rgba(239, 68, 68, 0))' },
    glowing: {
      filter: [
        'drop-shadow(0 0 0px rgba(74, 222, 128, 0)) drop-shadow(0 0 0px rgba(239, 68, 68, 0))',
        'drop-shadow(0 0 10px rgba(74, 222, 128, 0.7)) drop-shadow(0 0 10px rgba(239, 68, 68, 0.7))',
        'drop-shadow(0 0 5px rgba(74, 222, 128, 0.4)) drop-shadow(0 0 5px rgba(239, 68, 68, 0.4))',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  };

  // Check if goal is completed
  const totalAttempted = progress.correct + progress.incorrect;
  const isGoalCompleted = totalAttempted >= initialDailyGoal;

  // Calculate arc parameters
  const size = 220;
  const center = size / 2;
  const radius = 86;
  const stroke = 16;
  const circumference = 2 * Math.PI * radius;

  const clamp01 = (n) => Math.min(1, Math.max(0, n));

  const hasCorrect = progress.correct > 0;
  const hasIncorrect = progress.incorrect > 0;
  const hasBoth = hasCorrect && hasIncorrect;

  const gapLen = hasBoth ? circumference * 0.045 : 0;
  const usable = Math.max(0, circumference - gapLen);

  const correctRatio = initialDailyGoal > 0 ? clamp01(progress.correct / initialDailyGoal) : 0;
  const incorrectRatio = initialDailyGoal > 0 ? clamp01(progress.incorrect / initialDailyGoal) : 0;

  const correctLen = hasCorrect ? correctRatio * usable : 0;
  const incorrectLen = hasIncorrect ? incorrectRatio * usable : 0;

  const correctDash = `${Math.max(0.001, correctLen)} ${circumference}`;
  const incorrectDash = `${Math.max(0.001, incorrectLen)} ${circumference}`;
  const incorrectOffset = hasBoth ? -(correctLen + gapLen) : 0;


  return (
    <div className="relative w-full max-w-[420px] rounded-2xl bg-gradient-to-b from-[#0e1628] to-[#0a1020] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/5">
      <div className="flex items-center justify-between">
        <h3 className="text-[22px] font-semibold tracking-tight text-white">Daily Goal</h3>
        {editingGoal ? (
          <div className="flex items-center space-x-1">
            <input
              ref={inputRef}
              type="text"
              value={tempGoal}
              onChange={handleGoalChange}
              onKeyDown={handleKeyDown}
              className="w-14 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-center text-xs text-white outline-none focus:ring-2 focus:ring-sky-500/40"
            />
            <button 
              onClick={handleSaveGoal}
              className="rounded-md p-1 text-green-400 hover:bg-white/5 hover:text-green-300 transition-colors"
              title="Save"
            >
              <Check size={16} />
            </button>
            <button 
              onClick={handleCancelEdit}
              className="rounded-md p-1 text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowGoalModal(true)}
            className="pill-button small flex items-center"
            title="Edit daily goal"
          >
            <Pencil size={14} className="mr-2" />
            Edit Goal
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80 ring-1 ring-white/10">
          Progress
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
          <defs>
            <filter id="dg-glow-green" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -7"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="dg-glow-red" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -7"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform={`rotate(-90 ${center} ${center})`}>
          {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={stroke}
            />

            <motion.g initial="initial" animate={glow ? 'glowing' : 'initial'} variants={glowVariant}>
              {/* Incorrect answers arc */}
              {hasIncorrect && (
                <>
                  {isGoalCompleted && (
                    <motion.circle
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth={stroke + 5}
                      strokeLinecap="round"
                      filter="url(#dg-glow-red)"
                      initial={{ opacity: 0 }}
                      animate={{
                        strokeDasharray: incorrectDash,
                        strokeDashoffset: incorrectOffset,
                        opacity: [0.35, 0.65, 0.35],
                      }}
                      transition={{
                        opacity: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
                        strokeDasharray: { duration: 0.85, ease: 'easeOut' },
                        strokeDashoffset: { duration: 0.85, ease: 'easeOut' },
                      }}
                    />
                  )}

                  <motion.circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    initial={{
                      opacity: 0.65,
                      strokeDasharray: incorrectDash,
                      strokeDashoffset: incorrectOffset,
                    }}
                    animate={{
                      opacity: isGoalCompleted ? 1 : 0.82,
                      strokeDasharray: incorrectDash,
                      strokeDashoffset: incorrectOffset,
                    }}
                    transition={{
                      opacity: { duration: 0.35, ease: 'easeOut' },
                      strokeDasharray: { duration: 0.85, ease: 'easeOut' },
                      strokeDashoffset: { duration: 0.85, ease: 'easeOut' },
                    }}
                  />

                  {flashArc === 'red' && (
                    <motion.circle
                      key={`flash-red-${flashKey}`}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth={stroke + 6}
                      strokeLinecap="round"
                      strokeDasharray={incorrectDash}
                      strokeDashoffset={incorrectOffset}
                      filter="url(#dg-glow-red)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.9, 0] }}
                      transition={{ duration: 0.65, ease: 'easeOut' }}
                    />
                  )}
                </>
              )}

              {/* Correct answers arc */}
              {hasCorrect && (
                <>
                  {isGoalCompleted && (
                    <motion.circle
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth={stroke + 5}
                      strokeLinecap="round"
                      filter="url(#dg-glow-green)"
                      initial={{ opacity: 0 }}
                      animate={{
                        strokeDasharray: correctDash,
                        strokeDashoffset: 0,
                        opacity: [0.35, 0.65, 0.35],
                      }}
                      transition={{
                        opacity: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
                        strokeDasharray: { duration: 0.85, ease: 'easeOut' },
                        strokeDashoffset: { duration: 0.85, ease: 'easeOut' },
                      }}
                    />
                  )}

                  <motion.circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    initial={{ opacity: 0.65, strokeDasharray: correctDash, strokeDashoffset: 0 }}
                    animate={{
                      opacity: isGoalCompleted ? 1 : 0.82,
                      strokeDasharray: correctDash,
                      strokeDashoffset: 0,
                    }}
                    transition={{
                      opacity: { duration: 0.35, ease: 'easeOut' },
                      strokeDasharray: { duration: 0.85, ease: 'easeOut' },
                      strokeDashoffset: { duration: 0.85, ease: 'easeOut' },
                    }}
                  />

                  {flashArc === 'green' && (
                    <motion.circle
                      key={`flash-green-${flashKey}`}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth={stroke + 6}
                      strokeLinecap="round"
                      strokeDasharray={correctDash}
                      strokeDashoffset={0}
                      filter="url(#dg-glow-green)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.9, 0] }}
                      transition={{ duration: 0.65, ease: 'easeOut' }}
                    />
                  )}
                </>
              )}
            </motion.g>
          </g>
        </svg>

        {/* Center text */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-[44px] font-semibold leading-none text-white">
            {totalAttempted}
            <span className="text-white/60"> / {initialDailyGoal}</span>
          </div>
          <div className="mt-2 text-xs font-semibold tracking-[0.28em] text-white/45">ATTEMPTS</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-5 flex items-center justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#22C55E]" />
          <span className="text-sm font-medium text-white/80">{progress.correct} correct</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#EF4444]" />
          <span className="text-sm font-medium text-white/80">{progress.incorrect} incorrect</span>
        </div>
      </div>

      {/* Goal Edit Modal */}
      <GoalEditModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        currentGoal={tempGoal}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default DailyGoalProgress;
