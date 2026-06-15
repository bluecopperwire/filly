import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import { saveDocument, updateDocument } from '../services/api';

export function useAutoSave(intervalMs: number = 30000) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const {
    documentId,
    title,
    content,
    hasUnsavedChanges,
    setDocumentId,
    setSaving,
    setHasUnsavedChanges,
  } = useEditorStore();

  useEffect(() => {
    timerRef.current = setInterval(async () => {
      if (!hasUnsavedChanges || !content.trim()) return;

      setSaving(true);
      try {
        if (documentId) {
          await updateDocument(documentId, { title, content });
        } else {
          const doc = await saveDocument({ title, content });
          setDocumentId(doc.id);
        }
        setHasUnsavedChanges(false);
      } catch (err) {
        console.error('Auto-save failed:', err);
      } finally {
        setSaving(false);
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [documentId, title, content, hasUnsavedChanges, intervalMs, setDocumentId, setSaving, setHasUnsavedChanges]);
}
