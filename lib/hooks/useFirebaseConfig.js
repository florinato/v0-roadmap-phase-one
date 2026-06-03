'use client';

import { useEffect, useState } from 'react';

export function useFirebaseConfig() {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config', { cache: 'force-cache' });
        if (response.ok) {
          const data = await response.json();
          console.log('[v0] Firebase config loaded successfully');
          setConfig(data);
        }
      } catch (error) {
        console.error('[v0] Failed to load Firebase config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, isLoading };
}
