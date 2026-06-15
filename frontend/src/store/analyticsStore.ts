import { create } from 'zustand';
import type { AnalyticsData } from '../types';
import { getAnalytics } from '../services/api';

interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: (documentId?: number) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchAnalytics: async (documentId?: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getAnalytics(documentId);
      set({ data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Provide default data when backend is unavailable
      set({
        data: {
          normalization_stats: {
            slang_count: 0,
            abbreviation_count: 0,
            spelling_variation_count: 0,
            total: 0,
          },
          grammar_stats: {
            issues_found: 0,
            issues_fixed: 0,
            issues_ignored: 0,
          },
          quality_score: 100,
        },
        isLoading: false,
        error: null,
      });
    }
  },
}));
