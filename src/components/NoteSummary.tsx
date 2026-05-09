import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, ChevronRight } from 'lucide-react';

interface NoteSummaryProps {
  notes: string[];
}

export const NoteSummary: React.FC<NoteSummaryProps> = ({ notes }) => {
  if (notes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <ClipboardList size={14} className="text-accent" />
        <h3 className="text-xs font-mono opacity-50 uppercase tracking-widest">Captured_Ideas</h3>
        <span className="ml-auto text-[10px] font-mono opacity-30">{notes.length}_ITEMS</span>
      </div>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {notes.map((note, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-3 group"
          >
            <ChevronRight size={14} className="text-accent mt-0.5 flex-shrink-0 opacity-30 group-hover:opacity-100 transition-opacity" />
            <p className="font-mono text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              {note}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
