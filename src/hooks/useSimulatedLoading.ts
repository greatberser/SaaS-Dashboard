'use client';

import { useState, useEffect } from 'react';

export function useSimulatedLoading(ms = 1000): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(timer);
  }, [ms]);

  return loading;
}
