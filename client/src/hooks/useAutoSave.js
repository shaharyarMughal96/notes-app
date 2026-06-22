import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';
import { updateNote } from '../utils/api';

export function useAutoSave(noteId, data, enabled = true) {
  const debouncedData = useDebounce(data, 900);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving' | 'saved' | 'error'
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!noteId || !enabled) return;

    // Skip first run to avoid firing on mount
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    // Prevent saving if data is empty
    if (!debouncedData || Object.keys(debouncedData).length === 0) return;

    setSaveStatus('saving');
    updateNote(noteId, {
      title: debouncedData.title,
      content: debouncedData.content,
      tags: debouncedData.tags,
      color: debouncedData.color,
    })
      .then(() => setSaveStatus('saved'))
      .catch(() => setSaveStatus('error'));
  }, [debouncedData, noteId, enabled]);

  return saveStatus;
}
