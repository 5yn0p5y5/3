import { useState, useEffect } from 'react';
import { Heatmap } from './components/Heatmap';
import { Timer } from './components/Timer';
import { CommandPalette } from './components/CommandPalette';
import { useProtocol, DEBUG_ENABLED } from './hooks/useProtocol';
import { MOTD } from './components/MOTD';
import { NotePrompt } from './components/NotePrompt';
import { NoteSummary } from './components/NoteSummary';

function App() {
  const { 
    state, 
    startNext, 
    toggleTimer, 
    resetTimer, 
    skipPhase, 
    injectMockData,
    exportData,
    importData,
    addNote
  } = useProtocol();

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isNotePromptOpen, setIsNotePromptOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'p') || e.key === '/') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
      
      if (e.key === ' ' && !isPaletteOpen && !isNotePromptOpen) {
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

      if (e.key === 'n' && !isPaletteOpen && !isNotePromptOpen) {
        e.preventDefault();
        setIsNotePromptOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaletteOpen, isNotePromptOpen, state.phase, startNext, toggleTimer]);

  useEffect(() => {
    if (state.phase === 'IDLE') {
      if (state.currentBlock > 0) {
        document.title = '3 - DONE';
      } else {
        document.title = '3';
      }
    } else {
      const mins = Math.floor(state.timeLeft / 60);
      const secs = state.timeLeft % 60;
      const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
      document.title = `3 - ${timeStr}`;
    }
  }, [state.timeLeft, state.phase, state.currentBlock]);

  return (
    <main className="flex-1 flex flex-col p-12 w-full h-screen">
      <header className="flex justify-between items-start p-4">
        <div className="flex flex-col">
          <h1 className="text-6xl font-black accent-glow text-accent leading-none">3</h1>
          <MOTD />
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-item">
          <Timer 
            timeLeft={state.timeLeft} 
            phase={state.phase} 
            currentBlock={state.currentBlock}
            isActive={state.isActive}
          />
        </div>

        {state.phase === 'IDLE' && state.notes.length > 0 && (
          <div className="dashboard-item">
            <NoteSummary notes={state.notes} />
          </div>
        )}

        <div className="dashboard-item">
          <Heatmap history={state.history} />
        </div>
      </div>

      <footer className="mt-auto border-t-2 border-border pt-4 flex justify-between items-center font-mono text-[10px] opacity-30">
        <div className="flex gap-12">
          <span>CTRL+P OR / FOR PALETTE</span>
          <span>SPACE TO START/PAUSE</span>
          <span>N TO NOTE</span>
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
        onAddNote={() => setIsNotePromptOpen(true)}
        debugEnabled={DEBUG_ENABLED}
      />

      <NotePrompt 
        isOpen={isNotePromptOpen}
        onClose={() => setIsNotePromptOpen(false)}
        onSubmit={addNote}
      />
    </main>
  );
}

export default App;
