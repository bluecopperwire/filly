import { useEditorStore } from '../store/editorStore';

const MAX_WORDS = 250;

export default function WordCounter() {
  const wordCount = useEditorStore((s) => s.wordCount);
  const isOver = wordCount > MAX_WORDS;

  return (
    <div className="px-6 py-2.5 border-t border-border bg-surface-alt">
      <span
        className={`text-sm font-medium transition-colors ${
          isOver ? 'text-error' : 'text-text-muted'
        }`}
      >
        {wordCount} / {MAX_WORDS} words
      </span>
    </div>
  );
}
