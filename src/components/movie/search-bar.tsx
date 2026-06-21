'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search for a movie title..."
        aria-label="Search movies"
        className="pl-11 pr-12"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/50 transition hover:bg-white/8 hover:text-white"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
