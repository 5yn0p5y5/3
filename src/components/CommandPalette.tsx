import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Play, RotateCcw, FastForward, Database, X, Download, Upload, Lightbulb } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNext: () => void;
  onReset: () => void;
  onSkip: () => void;
  onInjectMock: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onAddNote: () => void;
  debugEnabled: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onStartNext,
  onReset,
  onSkip,
  onInjectMock,
  onExport,
  onImport,
  onAddNote,
  debugEnabled
}) => {
  const [search, setSearch] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setSearch('');
  }, [isOpen]);

  const commands = [
    { id: 'start', label: 'Start Next Block', icon: Play, action: onStartNext },
    { id: 'note', label: 'Add Note / Capture Idea', icon: Lightbulb, action: onAddNote },
    { id: 'reset', label: 'Reset Protocol', icon: RotateCcw, action: onReset },
    { id: 'export', label: 'EXPORT_DATA (BACKUP)', icon: Download, action: onExport },
    { id: 'import', label: 'IMPORT_DATA (RESTORE)', icon: Upload, action: () => fileInputRef.current?.click() },
    ...(debugEnabled ? [
      { id: 'skip', label: 'DEBUG: Skip Phase', icon: FastForward, action: onSkip },
      { id: 'mock', label: 'DEBUG: Inject Mock Data', icon: Database, action: onInjectMock },
    ] : []),
  ];

  const filtered = commands.filter(c => 
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-surface brutal-border overflow-hidden"
      >
        <div className="flex items-center gap-3 p-4 border-b-2 border-border">
          <Terminal size={18} className="text-accent" />
          <input
            autoFocus
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && filtered.length > 0) {
                filtered[0].action();
                onClose();
              }
            }}
          />
          <X 
            size={18} 
            className="opacity-30 cursor-pointer hover:opacity-100" 
            onClick={onClose}
          />
        </div>
        
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {filtered.map((cmd) => (
            <div
              key={cmd.id}
              onClick={() => { cmd.action(); onClose(); }}
              className="flex items-center gap-3 p-3 hover:bg-accent hover:text-black cursor-pointer group font-mono text-sm transition-colors"
            >
              <cmd.icon size={16} className="group-hover:text-black" />
              <span>{cmd.label}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-4 text-center opacity-30 font-mono text-xs">
              NO_MATCHING_COMMANDS
            </div>
          )}
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onImport(file);
              onClose();
            }
          }}
        />
        
        <div className="p-2 border-t-2 border-border bg-black/50 flex justify-between px-4">
          <span className="text-[10px] opacity-30 font-mono">ESC TO CLOSE</span>
          <span className="text-[10px] opacity-30 font-mono">ENTER TO EXECUTE</span>
        </div>
      </motion.div>
    </div>
  );
};
