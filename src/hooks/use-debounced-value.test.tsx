import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

describe('useDebouncedValue', () => {
  it('delays updates until the timeout elapses', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'trending' },
    });

    expect(result.current).toBe('trending');

    rerender({ value: 'search' });
    expect(result.current).toBe('trending');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('search');
    vi.useRealTimers();
  });
});
