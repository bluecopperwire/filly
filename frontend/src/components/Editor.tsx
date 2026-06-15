import { useEffect, useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { NormalizationMark } from '../editor/NormalizationMark';
import { GrammarMark } from '../editor/GrammarMark';
import { useEditorStore } from '../store/editorStore';
import { useDebounce } from '../hooks/useDebounce';
import type { SuggestionItem } from '../types';

interface EditorProps {
  onEditorReady: (editor: ReturnType<typeof useEditor>) => void;
}

export default function Editor({ onEditorReady }: EditorProps) {
  const { content, setContent, analyze, suggestions } = useEditorStore();
  const debouncedContent = useDebounce(content, 500);
  const isUpdatingRef = useRef(false);
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
      NormalizationMark,
      GrammarMark,
    ],
    content: content ? `<p>${content}</p>` : '',
    onUpdate: ({ editor }) => {
      if (isUpdatingRef.current) return;
      const text = editor.getText();
      setContent(text);
    },
    editorProps: {
      attributes: {
        class: 'tiptap',
        id: 'editor-content',
      },
      handleDOMEvents: {
        mouseover: (_view, event) => {
          const target = event.target as HTMLElement;

          // Check normalization marks
          const normMark = target.closest('.normalization-mark') as HTMLElement;
          if (normMark) {
            const word = normMark.getAttribute('data-word') || normMark.textContent;
            const suggestion = normMark.getAttribute('data-suggestion');
            if (word && suggestion) {
              const rect = normMark.getBoundingClientRect();
              setTooltip({
                text: `${word} → ${suggestion}`,
                x: rect.left + rect.width / 2,
                y: rect.top,
              });
            }
            return false;
          }

          // Check grammar marks
          const gramMark = target.closest('.grammar-mark') as HTMLElement;
          if (gramMark) {
            const correction = gramMark.getAttribute('data-correction');
            const message = gramMark.getAttribute('data-message');
            if (correction) {
              const rect = gramMark.getBoundingClientRect();
              setTooltip({
                text: message || `Suggestion: ${correction}`,
                x: rect.left + rect.width / 2,
                y: rect.top,
              });
            }
            return false;
          }

          setTooltip(null);
          return false;
        },
        mouseout: () => {
          setTooltip(null);
          return false;
        },
      },
    },
  });

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Debounced analysis
  useEffect(() => {
    if (debouncedContent.trim()) {
      analyze(debouncedContent);
    }
  }, [debouncedContent, analyze]);

  // Apply marks when suggestions change
  const applyMarks = useCallback(() => {
    if (!editor) return;

    isUpdatingRef.current = true;
    const text = editor.getText();

    // Remove all existing marks
    editor.commands.unsetMark('normalization');
    editor.commands.unsetMark('grammar');

    // Apply normalization marks
    suggestions.forEach((s: SuggestionItem) => {
      if (s.type === 'normalization') {
        // Find the word in text
        const wordLower = s.word.toLowerCase();
        let searchPos = 0;
        const textLower = text.toLowerCase();

        while (searchPos < text.length) {
          const foundIdx = textLower.indexOf(wordLower, searchPos);
          if (foundIdx === -1) break;

          // Only match whole words
          const before = foundIdx === 0 || /\s/.test(text[foundIdx - 1]);
          const after =
            foundIdx + s.word.length >= text.length ||
            /\s/.test(text[foundIdx + s.word.length]);

          if (before && after) {
            // TipTap positions: add 1 for the doc node offset
            const from = foundIdx + 1;
            const to = from + s.word.length;
            editor
              .chain()
              .setTextSelection({ from, to })
              .setMark('normalization', {
                suggestion: s.suggestion,
                word: s.word,
              })
              .run();
            break;
          }
          searchPos = foundIdx + 1;
        }
      } else if (s.type === 'grammar') {
        const original = s.original;
        const foundIdx = text.indexOf(original);
        if (foundIdx !== -1) {
          const from = foundIdx + 1;
          const to = from + original.length;
          editor
            .chain()
            .setTextSelection({ from, to })
            .setMark('grammar', {
              correction: s.correction,
              message: s.message,
              rule: s.rule,
            })
            .run();
        }
      }
    });

    // Reset selection to end
    editor.commands.setTextSelection(editor.state.doc.content.size);
    isUpdatingRef.current = false;
  }, [editor, suggestions]);

  useEffect(() => {
    applyMarks();
  }, [applyMarks]);

  return (
    <div className="relative flex-1 overflow-y-auto">
      <EditorContent editor={editor} />

      {/* Hover Tooltip */}
      {tooltip && (
        <div
          className="suggestion-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%) translateY(-8px)',
            position: 'fixed',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
