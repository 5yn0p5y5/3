import React, { useState, useEffect } from 'react';
import { quotes as fallbackQuotes, type Quote } from '../data/quotes';

// Remote repository for quotes (Raw JSON)
const REMOTE_QUOTES_URL = 'https://raw.githubusercontent.com/dwyl/quotes/master/quotes.json';

export const MOTD: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isRemote, setIsRemote] = useState(false);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch(REMOTE_QUOTES_URL);
        const data = await response.json();
        
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const index = seed % data.length;
        
        const remoteQuote = data[index];
        setQuote({
          text: remoteQuote.text || remoteQuote.quote,
          author: remoteQuote.author || 'Anonymous'
        });
        setIsRemote(true);
      } catch (error) {
        console.warn('Failed to fetch remote quotes, using fallback.', error);
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const index = seed % fallbackQuotes.length;
        setQuote(fallbackQuotes[index]);
        setIsRemote(false);
      }
    };

    fetchQuotes();
  }, []);

  if (!quote) return null;

  return (
    <div className="flex flex-col items-start mt-6 max-w-lg">
      <p className="font-mono text-[9px] opacity-30 uppercase tracking-[0.2em] mb-2">
        {isRemote ? 'ONLINE QUOTE' : 'OFFLINE QUOTE'}
      </p>
      <div className="border-l-2 border-accent/20 pl-3">
        <p className="font-mono text-[11px] text-accent/70 italic leading-relaxed">"{quote.text}"</p>
        <p className="font-mono text-[9px] opacity-30 mt-1 uppercase">— {quote.author}</p>
      </div>
    </div>
  );
};
