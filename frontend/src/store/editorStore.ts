import { create } from 'zustand';
import type { SuggestionItem, AnalyzeResponse } from '../types';
import { analyzeText } from '../services/api';

interface EditorState {
  // Document
  documentId: number | null;
  title: string;
  content: string;
  wordCount: number;

  // Suggestions
  suggestions: SuggestionItem[];
  isAnalyzing: boolean;
  lastAnalyzedText: string;

  // UI
  isSaving: boolean;
  hasUnsavedChanges: boolean;

  // Actions
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setDocumentId: (id: number | null) => void;
  setSaving: (saving: boolean) => void;
  setHasUnsavedChanges: (val: boolean) => void;
  analyze: (text: string) => Promise<void>;
  acceptSuggestion: (index: number) => void;
  ignoreSuggestion: (index: number) => void;
  clearSuggestions: () => void;
  reset: () => void;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  documentId: null,
  title: 'Untitled',
  content: '',
  wordCount: 0,
  suggestions: [],
  isAnalyzing: false,
  lastAnalyzedText: '',
  isSaving: false,
  hasUnsavedChanges: false,

  setTitle: (title) => set({ title, hasUnsavedChanges: true }),

  setContent: (content) =>
    set({
      content,
      wordCount: countWords(content),
      hasUnsavedChanges: true,
    }),

  setDocumentId: (id) => set({ documentId: id }),

  setSaving: (saving) => set({ isSaving: saving }),

  setHasUnsavedChanges: (val) => set({ hasUnsavedChanges: val }),

  analyze: async (text: string) => {
    const state = get();
    if (state.isAnalyzing || text === state.lastAnalyzedText) return;
    if (!text.trim()) {
      set({ suggestions: [], lastAnalyzedText: text });
      return;
    }

    set({ isAnalyzing: true });
    try {
      const response: AnalyzeResponse = await analyzeText(text);
      const allSuggestions: SuggestionItem[] = [
        ...response.normalizations,
        ...response.grammar_corrections,
      ];
      set({
        suggestions: allSuggestions,
        lastAnalyzedText: text,
        isAnalyzing: false,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      set({ isAnalyzing: false });
    }
  },

  acceptSuggestion: (index: number) => {
    const { suggestions } = get();
    set({ suggestions: suggestions.filter((_, i) => i !== index) });
  },

  ignoreSuggestion: (index: number) => {
    const { suggestions } = get();
    set({ suggestions: suggestions.filter((_, i) => i !== index) });
  },

  clearSuggestions: () => set({ suggestions: [] }),

  reset: () =>
    set({
      documentId: null,
      title: 'Untitled',
      content: '',
      wordCount: 0,
      suggestions: [],
      isAnalyzing: false,
      lastAnalyzedText: '',
      isSaving: false,
      hasUnsavedChanges: false,
    }),
}));
