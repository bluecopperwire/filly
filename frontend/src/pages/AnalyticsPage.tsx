import { useEffect } from 'react';
import { useAnalyticsStore } from '../store/analyticsStore';
import {
  SpellCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  MessageSquare,
  FileText,
  Type,
} from 'lucide-react';

function ScoreRing({ score }: { score: number }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? 'var(--color-success)'
      : score >= 50
        ? 'var(--color-warning)'
        : 'var(--color-error)';

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="var(--color-border-light)"
          strokeWidth="8"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-text-primary">{score}</span>
        <span className="text-xs text-text-muted font-medium">/ 100</span>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

function StatCard({ icon, label, value, color, bgColor }: StatCardProps) {
  return (
    <div className="stat-card bg-white rounded-2xl border border-border p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading, fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { normalization_stats, grammar_stats, quality_score } = data;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
          <p className="text-sm text-text-secondary mt-1">
            Overview of your Filipino writing quality
          </p>
        </div>

        {/* Quality Score */}
        <div
          className="bg-white rounded-2xl border border-border p-8 shadow-sm mb-8 animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          <h2 className="text-base font-bold text-text-primary mb-5 text-center">
            Overall Writing Quality
          </h2>
          <ScoreRing score={quality_score} />
          <p className="text-center text-sm text-text-secondary mt-4">
            {quality_score >= 80
              ? 'Excellent! Your Filipino writing is well-formed.'
              : quality_score >= 50
                ? 'Good progress. Review the suggestions to improve.'
                : 'Needs improvement. Check the recommendations.'}
          </p>
        </div>

        {/* Normalization Stats */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <SpellCheck size={18} className="text-primary" />
            <h2 className="text-base font-bold text-text-primary">
              Normalization Statistics
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={<MessageSquare size={18} />}
              label="Slang"
              value={normalization_stats.slang_count}
              color="var(--color-error)"
              bgColor="var(--color-error-light)"
            />
            <StatCard
              icon={<Type size={18} />}
              label="Abbreviations"
              value={normalization_stats.abbreviation_count}
              color="var(--color-warning)"
              bgColor="var(--color-warning-light)"
            />
            <StatCard
              icon={<FileText size={18} />}
              label="Spelling Variations"
              value={normalization_stats.spelling_variation_count}
              color="var(--color-info)"
              bgColor="var(--color-info-light)"
            />
          </div>
        </div>

        {/* Grammar Stats */}
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-primary" />
            <h2 className="text-base font-bold text-text-primary">
              Grammar Statistics
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={<TrendingUp size={18} />}
              label="Issues Found"
              value={grammar_stats.issues_found}
              color="var(--color-info)"
              bgColor="var(--color-info-light)"
            />
            <StatCard
              icon={<CheckCircle size={18} />}
              label="Issues Fixed"
              value={grammar_stats.issues_fixed}
              color="var(--color-success)"
              bgColor="var(--color-success-light)"
            />
            <StatCard
              icon={<XCircle size={18} />}
              label="Issues Ignored"
              value={grammar_stats.issues_ignored}
              color="var(--color-error)"
              bgColor="var(--color-error-light)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
