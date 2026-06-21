'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const startPage = Math.max(1, page - 1);
  const endPage = Math.min(totalPages, page + 1);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  return (
    <Card className="mx-auto w-fit border-white/10 bg-black/35 px-3 py-2 shadow-none">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8 rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 ? <span className="px-1 text-white/35">...</span> : null}

        {pages.map((candidate) => (
          <button
            key={candidate}
            type="button"
            onClick={() => onPageChange(candidate)}
            className={cn(
              'flex h-8 min-w-8 items-center justify-center rounded-full px-3 text-sm transition',
              candidate === page
                ? 'bg-white text-black font-semibold'
                : 'border border-white/10 bg-transparent text-white/75 hover:bg-white/10 hover:text-white',
            )}
          >
            {candidate}
          </button>
        ))}

        {endPage < totalPages ? <span className="px-1 text-white/35">...</span> : null}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-8 w-8 rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
