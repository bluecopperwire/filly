import { useEditorStore } from '../store/editorStore';
import SuggestionCard from './SuggestionCard';
import { Sparkles, Loader2 } from 'lucide-react';

interface RecommendationsPanelProps {
  onAcceptSuggestion: (index: number) => void;
}

export default function RecommendationsPanel({ onAcceptSuggestion }: RecommendationsPanelProps) {
  const suggestions = useEditorStore((s) => s.suggestions);
  const isAnalyzing = useEditorStore((s) => s.isAnalyzing);
  const ignoreSuggestion = useEditorStore((s) => s.ignoreSuggestion);

  return (
    <aside className="w-72 bg-surface-alt border-l border-border flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-bold text-text-primary tracking-tight">
          Recommendations
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-text-muted">
            Suggestions ({suggestions.length})
          </span>
          {isAnalyzing && (
            <Loader2 size={12} className="animate-spin text-primary" />
          )}
        </div>
      </div>

      {/* Suggestions List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 bg-success-light rounded-2xl flex items-center justify-center mb-3">
              <Sparkles size={20} className="text-success" />
            </div>
            <p className="text-sm font-medium text-text-secondary">
              No suggestions
            </p>
            <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-[180px]">
              Your text looks formal!
            </p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={`${suggestion.type}-${suggestion.start}-${index}`}
              suggestion={suggestion}
              index={index}
              onAccept={onAcceptSuggestion}
              onIgnore={ignoreSuggestion}
            />
          ))
        )}
      </div>
    </aside>
  );
}
