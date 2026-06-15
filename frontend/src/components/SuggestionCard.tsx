import type { SuggestionItem } from '../types';
import { Check, X, AlertTriangle, SpellCheck } from 'lucide-react';

interface SuggestionCardProps {
  suggestion: SuggestionItem;
  index: number;
  onAccept: (index: number) => void;
  onIgnore: (index: number) => void;
}

export default function SuggestionCard({
  suggestion,
  index,
  onAccept,
  onIgnore,
}: SuggestionCardProps) {
  const isNormalization = suggestion.type === 'normalization';

  return (
    <div
      className="animate-slide-in-right rounded-xl border border-border bg-white p-4 shadow-sm
                 hover:shadow-md transition-shadow duration-200"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        {isNormalization ? (
          <div className="w-6 h-6 rounded-md bg-error-light flex items-center justify-center">
            <SpellCheck size={14} className="text-error" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-md bg-info-light flex items-center justify-center">
            <AlertTriangle size={14} className="text-info" />
          </div>
        )}
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {isNormalization ? 'Normalization' : (suggestion as any).rule || 'Grammar'}
        </span>
      </div>

      {/* Original */}
      <div className="mb-1">
        <span className="text-xs text-text-muted">Original:</span>
        <p className="text-sm font-medium text-text-primary mt-0.5">
          <span className={`${isNormalization ? 'text-error' : 'text-info'}`}>
            {isNormalization ? suggestion.word : (suggestion as any).original}
          </span>
        </p>
      </div>

      {/* Suggestion */}
      <div className="mb-3">
        <span className="text-xs text-text-muted">Suggestion:</span>
        <p className="text-sm font-medium text-success mt-0.5">
          {isNormalization ? suggestion.suggestion : (suggestion as any).correction}
        </p>
      </div>

      {/* Message (grammar only) */}
      {!isNormalization && (suggestion as any).message && (
        <p className="text-xs text-text-secondary mb-3 leading-relaxed">
          {(suggestion as any).message}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onAccept(index)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3
                     text-xs font-semibold text-white bg-success rounded-lg
                     hover:bg-success/90 transition-colors cursor-pointer"
        >
          <Check size={14} />
          Accept
        </button>
        <button
          onClick={() => onIgnore(index)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3
                     text-xs font-semibold text-text-secondary bg-surface rounded-lg border border-border
                     hover:bg-border-light transition-colors cursor-pointer"
        >
          <X size={14} />
          Ignore
        </button>
      </div>
    </div>
  );
}
