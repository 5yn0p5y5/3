import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

interface NotePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export const NotePrompt: React.FC<NotePromptProps> = ({ isOpen, onClose, onSubmit }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) setText('');
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-surface brutal-border p-6 relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 opacity-30 hover:opacity-100 transition-opacity"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-sm">
                <Lightbulb size={20} className="text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-black text-accent leading-none uppercase">Capture_Idea</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                autoFocus
                placeholder="What did you just cook up? Type here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ color: 'var(--fg)' }}
                className="w-full bg-black/50 border-2 border-border p-4 font-mono text-sm outline-none focus:border-accent transition-colors min-h-[120px] resize-none mb-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                  if (e.key === 'Escape') {
                    onClose();
                  }
                }}
              />
              
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono opacity-30">ENTER_TO_SAVE // ESC_TO_CANCEL</span>
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="bg-accent text-black px-4 py-2 font-black text-xs uppercase brutal-border hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Save_Note
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
