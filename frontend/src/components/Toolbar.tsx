import { Upload, Save, Loader2 } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { saveDocument, updateDocument, uploadFile } from '../services/api';
import { useRef } from 'react';

export default function Toolbar() {
  const {
    documentId,
    title,
    content,
    isSaving,
    setTitle,
    setDocumentId,
    setSaving,
    setHasUnsavedChanges,
    setContent,
  } = useEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!content.trim()) return;
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
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file);
      setContent(result.text);
      setTitle(file.name.replace(/\.(txt|docx)$/i, ''));
    } catch (err) {
      console.error('Upload failed:', err);
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface-alt">
      {/* Document Title */}
      <input
        id="document-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-base font-semibold bg-transparent border-none outline-none text-text-primary
                   placeholder:text-text-muted min-w-0 flex-1 max-w-xs
                   focus:border-b-2 focus:border-primary transition-all"
        placeholder="Untitled"
      />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.docx"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Button */}
        <button
          id="upload-btn"
          onClick={handleUpload}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                     text-text-secondary bg-surface border border-border rounded-lg
                     hover:bg-border-light hover:border-text-muted
                     transition-all duration-200 cursor-pointer"
        >
          <Upload size={16} />
          Upload File
        </button>

        {/* Save Button */}
        <button
          id="save-btn"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold
                     text-primary-dark bg-accent rounded-lg
                     hover:bg-accent-dark
                     disabled:opacity-60 disabled:cursor-not-allowed
                     shadow-sm shadow-accent/20
                     transition-all duration-200 cursor-pointer"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save
        </button>
      </div>
    </div>
  );
}
