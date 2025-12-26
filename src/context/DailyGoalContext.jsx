import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'hybridx.dailyGoal.v2';

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const defaultState = (target = 15) => ({
  date: todayKey(),
  target,
  correct: 0,
  incorrect: 0,
});

const DailyGoalContext = createContext({
  target: 15,
  correct: 0,
  incorrect: 0,
  setTarget: () => {},
  recordAttempt: () => {},
  resetToday: () => {}
});

export const DailyGoalProvider = ({ children, defaultTarget = 15 }) => {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState(defaultTarget);
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return defaultState(defaultTarget);

      const t = todayKey();
      if (parsed.date !== t) {
        return {
          ...defaultState(typeof parsed.target === 'number' ? parsed.target : defaultTarget),
        };
      }

      return {
        date: t,
        target: typeof parsed.target === 'number' ? parsed.target : defaultTarget,
        correct: typeof parsed.correct === 'number' ? parsed.correct : 0,
        incorrect: typeof parsed.incorrect === 'number' ? parsed.incorrect : 0,
      };
    } catch {
      return defaultState(defaultTarget);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const resetToday = useCallback(() => {
    setState((prev) => ({
      date: todayKey(),
      target: prev?.target ?? defaultTarget,
      correct: 0,
      incorrect: 0,
    }));
  }, [defaultTarget]);

  const setTarget = useCallback(
    (target) => {
      const nextTarget = Number.isFinite(target) ? Math.max(1, Math.floor(target)) : defaultTarget;
      setState((prev) => ({
        ...(prev ?? defaultState(defaultTarget)),
        date: todayKey(),
        target: nextTarget,
      }));
    },
    [defaultTarget]
  );

  const recordAttempt = useCallback((isCorrect) => {
    setState((prev) => {
      const current = prev ?? defaultState(defaultTarget);
      const t = todayKey();
      const base = current.date === t ? current : { ...defaultState(current.target ?? defaultTarget) };

      const total = (base.correct ?? 0) + (base.incorrect ?? 0);
      const cap = typeof base.target === 'number' && Number.isFinite(base.target) ? Math.max(1, Math.floor(base.target)) : defaultTarget;
      if (total >= cap) return { ...base, target: cap };

      if (isCorrect) {
        return { ...base, correct: (base.correct ?? 0) + 1 };
      }
      return { ...base, incorrect: (base.incorrect ?? 0) + 1 };
    });
  }, [defaultTarget]);

  const value = useMemo(
    () => ({
      ...state,
      total: (state.correct ?? 0) + (state.incorrect ?? 0),
      setTarget,
      resetToday,
      recordAttempt,
    }),
    [recordAttempt, resetToday, setTarget, state]
  );

  return <DailyGoalContext.Provider value={value}>{children}</DailyGoalContext.Provider>;
};

export const useDailyGoal = () => {
  const ctx = useContext(DailyGoalContext);
  if (!ctx) {
    throw new Error('useDailyGoal must be used within a DailyGoalProvider');
  }
  return ctx;
};
