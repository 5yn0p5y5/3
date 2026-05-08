import { useState, useEffect } from 'react';
import { Heatmap } from './components/Heatmap';
import { Timer } from './components/Timer';
import { CommandPalette } from './components/CommandPalette';
import { useProtocol, DEBUG_ENABLED } from './hooks/useProtocol';
import { MOTD } from './components/MOTD';

function App() {
  const { 
    state, 
    startNext, 
    toggleTimer, 
    resetTimer, 
    skipPhase, 
    injectMockData,
    exportData,
    importData
  } = useProtocol();

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'p') || e.key === '/') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
      
      if (e.key === ' ' && !isPaletteOpen) {
        e.preventDefault();
        if (state.phase === 'IDLE') {
          startNext();
        } else {
          toggleTimer();
        }
      }

      if (e.key === 'Escape' && isPaletteOpen) {
        setIsPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaletteOpen, state.phase, startNext, toggleTimer]);

  return (
    <main className="flex-1 flex flex-col p-12 w-full h-screen">
      <header className="flex justify-between items-start p-4">
        <div className="flex flex-col">
          <h1 className="text-6xl font-black accent-glow text-accent leading-none">3</h1>
          <MOTD />
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-half">
          <Timer 
            timeLeft={state.timeLeft} 
            phase={state.phase} 
            currentBlock={state.currentBlock}
            isActive={state.isActive}
          />
        </div>
        <div className="dashboard-half">
          <Heatmap history={state.history} />
        </div>
      </div>

      <footer className="mt-auto border-t-2 border-border pt-4 flex justify-between items-center font-mono text-[10px] opacity-30">
        <div className="flex gap-12">
          <span>CTRL+P OR / FOR PALETTE</span>
          <span>SPACE TO START/PAUSE</span>
        </div>
        <span>V1.1.0</span>
      </footer>

      <CommandPalette 
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onStartNext={startNext}
        onReset={resetTimer}
        onSkip={skipPhase}
        onInjectMock={injectMockData}
        onExport={exportData}
        onImport={importData}
        debugEnabled={DEBUG_ENABLED}
      />
    </main>
  );
}

export default App;
