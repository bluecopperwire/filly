import { useCallback, useRef } from 'react';
import type { Editor as TiptapEditor } from '@tiptap/react';
import Toolbar from '../components/Toolbar';
import EditorComponent from '../components/Editor';
import WordCounter from '../components/WordCounter';
import RecommendationsPanel from '../components/RecommendationsPanel';
import { useEditorStore } from '../store/editorStore';
import { useAutoSave } from '../hooks/useAutoSave';

export default function WritePage() {
  const editorRef = useRef<TiptapEditor | null>(null);
  const { suggestions, acceptSuggestion, setContent } = useEditorStore();

  // Auto-save every 30 seconds
  useAutoSave(30000);

  const handleEditorReady = useCallback((editor: TiptapEditor | null) => {
    editorRef.current = editor;
  }, []);

  const handleAcceptSuggestion = useCallback(
    (index: number) => {
      const suggestion = suggestions[index];
      if (!suggestion || !editorRef.current) return;

      const editor = editorRef.current;
      const text = editor.getText();

      if (suggestion.type === 'normalization') {
        // Replace the word in text
        const wordLower = suggestion.word.toLowerCase();
        const textLower = text.toLowerCase();
        const foundIdx = textLower.indexOf(wordLower);

        if (foundIdx !== -1) {
          const from = foundIdx + 1; // TipTap offset
          const to = from + suggestion.word.length;
          editor
            .chain()
            .setTextSelection({ from, to })
            .insertContent(suggestion.suggestion)
            .run();
          setContent(editor.getText());
        }
      } else if (suggestion.type === 'grammar') {
        const foundIdx = text.indexOf(suggestion.original);
        if (foundIdx !== -1) {
          const from = foundIdx + 1;
          const to = from + suggestion.original.length;
          editor
            .chain()
            .setTextSelection({ from, to })
            .insertContent(suggestion.correction)
            .run();
          setContent(editor.getText());
        }
      }

      acceptSuggestion(index);
    },
    [suggestions, acceptSuggestion, setContent]
  );

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Toolbar />
        <div className="flex-1 overflow-hidden bg-surface-alt rounded-none">
          <EditorComponent onEditorReady={handleEditorReady} />
        </div>
        <WordCounter />
      </div>

      {/* Recommendations Panel */}
      <RecommendationsPanel onAcceptSuggestion={handleAcceptSuggestion} />
    </div>
  );
}
