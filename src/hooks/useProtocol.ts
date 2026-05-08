import { useState, useEffect, useCallback } from 'react';

export type Phase = 'IDLE' | 'WARMUP' | 'WORK';

export interface ProtocolState {
  phase: Phase;
  currentBlock: number; // 0, 1, 2, or 3 (complete)
  timeLeft: number;
  isActive: boolean;
  history: Record<string, number>;
  lastUpdate: string; // ISO date string
}

const STORAGE_KEY = 'protocol-3-state';

export const DEBUG_ENABLED = true; // Toggle for debug features

export function useProtocol() {
  const [state, setState] = useState<ProtocolState>(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
      const parsed = JSON.parse(saved) as ProtocolState;
      
      // AUTO-RESET LOGIC: If the last update was NOT today, reset the daily session
      if (parsed.lastUpdate !== today) {
        return {
          ...parsed,
          phase: 'IDLE',
          currentBlock: 0,
          timeLeft: 0,
          isActive: false,
          lastUpdate: today
        };
      }
      
      // Otherwise, restore the session (but keep it paused)
      return { ...parsed, isActive: false };
    }
    
    return {
      phase: 'IDLE',
      currentBlock: 0,
      timeLeft: 0,
      isActive: false,
      history: {},
      lastUpdate: today,
    };
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastUpdate: today }));
  }, [state]);

  // Periodic check for day change (in case the app is left open across midnight)
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toISOString().split('T')[0];
      if (state.lastUpdate !== today) {
        setState(prev => ({
          ...prev,
          phase: 'IDLE',
          currentBlock: 0,
          timeLeft: 0,
          isActive: false,
          lastUpdate: today
        }));
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.lastUpdate]);

  const addBlockToHistory = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      const currentCount = prev.history[today] || 0;
      return {
        ...prev,
        history: {
          ...prev.history,
          [today]: Math.min(currentCount + 1, 3),
        },
      };
    });
  }, []);

  const handleTimerEnd = useCallback(() => {
    setState(prev => {
      if (prev.phase === 'WARMUP') {
        return {
          ...prev,
          phase: 'WORK',
          timeLeft: 90 * 60,
          isActive: true,
        };
      } else if (prev.phase === 'WORK') {
        addBlockToHistory();
        if (prev.currentBlock < 2) {
          return {
            ...prev,
            phase: 'IDLE',
            currentBlock: prev.currentBlock + 1,
            timeLeft: 0,
            isActive: false,
          };
        } else {
          return {
            ...prev,
            phase: 'IDLE',
            currentBlock: 3, // All blocks finished
            timeLeft: 0,
            isActive: false,
          };
        }
      }
      return prev;
    });
  }, [addBlockToHistory]);

  useEffect(() => {
    let interval: number;
    if (state.isActive && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000) as unknown as number;
    } else if (state.isActive && state.timeLeft === 0) {
      handleTimerEnd();
    }
    return () => clearInterval(interval);
  }, [state.isActive, state.timeLeft, handleTimerEnd]);

  const startNext = () => {
    setState(prev => {
      if (prev.phase === 'IDLE') {
        return {
          ...prev,
          phase: 'WARMUP',
          timeLeft: 5 * 60,
          isActive: true,
        };
      }
      return prev;
    });
  };

  const toggleTimer = () => {
    setState(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const resetTimer = () => {
    setState(prev => ({ ...prev, isActive: false, timeLeft: 0, phase: 'IDLE', currentBlock: 0 }));
  };

  // Debug methods
  const skipPhase = () => {
    if (!DEBUG_ENABLED) return;
    handleTimerEnd();
  };

  const injectMockData = () => {
    if (!DEBUG_ENABLED) return;
    const mockHistory: Record<string, number> = {};
    const today = new Date();
    for (let i = 1; i <= 40; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      mockHistory[dateStr] = Math.floor(Math.random() * 4);
    }
    setState(prev => ({ ...prev, history: { ...prev.history, ...mockHistory } }));
  };

  const exportData = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protocol-3-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        // Basic validation
        if (parsed.history && typeof parsed.currentBlock === 'number') {
          setState({ ...parsed, isActive: false });
          alert('SYSTEM_DATA_RESTORED');
        }
      } catch (err) {
        alert('ERROR_INVALID_DATA_FORMAT');
      }
    };
    reader.readAsText(file);
  };

  return {
    state,
    startNext,
    toggleTimer,
    resetTimer,
    skipPhase,
    injectMockData,
    exportData,
    importData,
  };
}
