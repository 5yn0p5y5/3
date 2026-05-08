import React from 'react';
import type { Phase } from '../hooks/useProtocol';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerProps {
  timeLeft: number;
  phase: Phase;
  currentBlock: number;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, phase, currentBlock, isActive }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseInfo = () => {
    if (currentBlock === 3) {
      return { label: 'PROTOCOL_COMPLETE', color: 'var(--accent)', message: 'SEE YOU TOMORROW' };
    }
    switch (phase) {
      case 'WARMUP':
        return { label: `WARMUP_${currentBlock + 1}`, color: 'var(--warmup)', message: '' };
      case 'WORK':
        return { label: `BLOCK_${currentBlock + 1}_ACTIVE`, color: 'var(--accent)', message: '' };
      default:
        return { label: 'IDLE_WAITING', color: 'rgba(255,255,255,0.2)', message: `READY_TO_START_BLOCK_${currentBlock + 1}` };
    }
  };

  const info = getPhaseInfo();

  return (
    <div className="flex flex-col items-center justify-center flex-1 py-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase + (currentBlock === 3 ? 'done' : '')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center"
        >
          <div 
            className="font-mono text-sm mb-4 px-3 py-1 brutal-border bg-black"
            style={{ color: info.color }}
          >
            {info.label}
          </div>
          
          <div 
            className="text-8xl font-black tracking-tighter leading-none select-none font-mono text-center"
            style={{ 
              color: info.color,
              textShadow: (isActive || currentBlock === 3) ? `0 0 20px ${info.color}` : 'none',
              opacity: (isActive || currentBlock === 3) ? 1 : 0.5
            }}
          >
            {currentBlock === 3 ? info.message : formatTime(timeLeft)}
          </div>
          
          {!isActive && phase !== 'IDLE' && currentBlock !== 3 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 font-mono text-xs uppercase opacity-50 pulse"
            >
              PAUSED_PRESS_SPACE_TO_RESUME
            </motion.div>
          )}

          {phase === 'IDLE' && currentBlock !== 3 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 font-mono text-xs uppercase opacity-50 pulse"
            >
              {info.message}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
