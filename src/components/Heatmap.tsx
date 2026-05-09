import React, { useState } from 'react';

interface HeatmapProps {
  history: Record<string, number>;
}

export const Heatmap: React.FC<HeatmapProps> = ({ history }) => {
  const [hovered, setHovered] = useState<{ date: string, count: number } | null>(null);
  const weeks = 20;
  const daysPerWeek = 7;
  const totalDays = weeks * daysPerWeek;
  
  const today = new Date();
  const cells = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const count = history[dateStr] || 0;
    cells.push({ dateStr, count });
  }

  // Group cells by week for vertical columns (GitHub style)
  const columns = [];
  for (let i = 0; i < cells.length; i += 7) {
    columns.push(cells.slice(i, i + 7));
  }

  const getColor = (count: number) => {
    switch (count) {
      case 1: return 'var(--accent-muted)';
      case 2: return 'rgba(0, 255, 65, 0.5)';
      case 3: return 'var(--accent)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  return (
    <div className="flex flex-col gap-2 p-6 brutal-border bg-surface w-fit">
      <div className="flex items-center justify-between mb-2 min-w-[200px]">
        <h3 className="text-xs opacity-50 font-mono">
          {hovered ? `${hovered.date}: ${hovered.count} BLOCKS` : 'ACTIVITY_LOG'}
        </h3>
        <div className="flex gap-1 items-center">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              style={{ backgroundColor: getColor(i) }} 
              className="w-2 h-2 rounded-sm"
            />
          ))}
        </div>
      </div>
      <div className="flex gap-1.5">
        {columns.map((week, wIndex) => (
          <div key={wIndex} className="flex flex-col gap-1.5">
            {week.map((day) => (
              <div
                key={day.dateStr}
                onMouseEnter={() => setHovered({ date: day.dateStr, count: day.count })}
                onMouseLeave={() => setHovered(null)}
                className="w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 cursor-pointer"
                style={{ 
                  backgroundColor: getColor(day.count),
                  boxShadow: day.count === 3 ? '0 0 5px var(--accent)' : 'none'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
