// ─── Document ───────────────────────────────────────────────

export interface Document {
  id: number;
  title: string;
  content: string;
  word_count: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentCreate {
  title: string;
  content: string;
}

export interface DocumentUpdate {
  title?: string;
  content?: string;
}

// ─── Suggestions ────────────────────────────────────────────

export type SuggestionType = 'normalization' | 'grammar';

export interface NormalizationItem {
  word: string;
  suggestion: string;
  start: number;
  end: number;
  type: 'normalization';
  confidence: number;
}

export interface GrammarCorrectionItem {
  original: string;
  correction: string;
  start: number;
  end: number;
  type: 'grammar';
  rule: string;
  message: string;
}

export type SuggestionItem = NormalizationItem | GrammarCorrectionItem;

export interface AnalyzeRequest {
  text: string;
}

export interface AnalyzeResponse {
  normalizations: NormalizationItem[];
  grammar_corrections: GrammarCorrectionItem[];
}

// ─── Stored Suggestion (DB) ─────────────────────────────────

export interface Suggestion {
  id: number;
  document_id: number;
  type: SuggestionType;
  original: string;
  suggestion: string;
  start_pos: number;
  end_pos: number;
  accepted: boolean;
  ignored: boolean;
  created_at: string;
}

// ─── Analytics ──────────────────────────────────────────────

export interface NormalizationStats {
  slang_count: number;
  abbreviation_count: number;
  spelling_variation_count: number;
  total: number;
}

export interface GrammarStats {
  issues_found: number;
  issues_fixed: number;
  issues_ignored: number;
}

export interface AnalyticsData {
  normalization_stats: NormalizationStats;
  grammar_stats: GrammarStats;
  quality_score: number;
}

// ─── UI State ───────────────────────────────────────────────

export type NavPage = 'write' | 'analytics' | 'guide';
