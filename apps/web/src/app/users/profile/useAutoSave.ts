import { useState, useEffect, useRef, useCallback } from "react";

export function useAutoSave<T extends { id: string }>(onSave: (payload: T[]) => Promise<any>, delay = 1500) {
  const dirtyQueue = useRef<Record<string, T>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const flush = useCallback(async () => {
    clearTimer();
    const itemsToSave = Object.values(dirtyQueue.current);
    if (itemsToSave.length === 0) return;

    setIsSaving(true);
    try {
      await onSave(itemsToSave);
      dirtyQueue.current = {};
    } catch (error) {
      console.error("Autosave failed:", error);
    } finally {
      setIsSaving(false);
    }
  }, [onSave, clearTimer]);

  const queueUpdate = useCallback(
    (data: T) => {
      clearTimer();

      dirtyQueue.current[data.id] = data;

      timeoutRef.current = setTimeout(() => {
        flush();
      }, delay);
    },
    [clearTimer, flush, delay],
  );

  useEffect(() => {
    return () => {
      if (Object.keys(dirtyQueue.current).length > 0) {
        flush();
      }
    };
  }, [flush]);

  return { queueUpdate, flush, isSaving };
}
