'use client';

import { useCallback, useRef } from 'react';
import { track } from '@/lib/analytics/client';
import { saveLastToolResult, type LastToolResult } from '@/lib/analytics/last-tool';

/**
 * Mide el uso de una calculadora SIN ruido: un evento la primera vez que la persona
 * interactúa (y otro por cada objetivo distinto). Guarda siempre el último resultado.
 */
export function useToolTracking(tool: LastToolResult['tool']) {
  const seen = useRef(new Set<string>());
  return useCallback(
    (result: Omit<LastToolResult, 'tool'>, goal?: string) => {
      saveLastToolResult({ tool, ...result });
      const key = goal ?? 'any';
      if (seen.current.has(key)) return;
      seen.current.add(key);
      track('calculator_used', { tool, goal });
    },
    [tool],
  );
}
