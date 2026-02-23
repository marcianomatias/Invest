import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Asset, MOCK_ASSETS } from '../types';
import { cn } from '../utils';

interface SearchAutocompleteProps {
  onSelect: (asset: Asset) => void;
  assets: Asset[];
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ onSelect, assets }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Asset[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = assets.filter(
        asset => 
          asset.ticker.toLowerCase().includes(query.toLowerCase()) ||
          asset.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [query, assets]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        onSelect(suggestions[selectedIndex]);
        setQuery('');
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary group-focus-within:text-brand-accent transition-colors" />
        <input
          type="text"
          className="w-full bg-brand-card border border-brand-border rounded-xl py-3 pl-12 pr-10 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all placeholder:text-brand-text-secondary"
          placeholder="Buscar ticker ou nome (ex: PETR4)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 glass-card max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.map((asset, index) => (
            <button
              key={asset.ticker}
              onClick={() => {
                onSelect(asset);
                setQuery('');
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between p-4 hover:bg-brand-border/50 transition-colors text-left border-b border-brand-border last:border-0",
                selectedIndex === index && "bg-brand-border/80 border-l-4 border-l-brand-accent"
              )}
            >
              <div>
                <div className="font-bold text-brand-text-primary">{asset.ticker}</div>
                <div className="text-xs text-brand-text-secondary">{asset.name}</div>
              </div>
              <div className="text-xs px-2 py-1 rounded bg-brand-border text-brand-text-secondary font-medium">
                {asset.type}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
