import {
  BookOpen,
  SpellCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

interface GuideSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}

function GuideSection({ icon, title, children, delay = 0 }: GuideSectionProps) {
  return (
    <section
      className="bg-white rounded-2xl border border-border p-6 shadow-sm animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      </div>
      <div className="text-sm text-text-secondary leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

function ExampleBox({
  input,
  output,
  label,
}: {
  input: string;
  output: string;
  label?: string;
}) {
  return (
    <div className="bg-surface rounded-xl p-4 border border-border-light mt-3">
      {label && (
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
          {label}
        </span>
      )}
      <div className="flex items-center gap-3">
        <code className="text-sm font-mono text-error bg-error-light px-2 py-0.5 rounded">
          {input}
        </code>
        <ArrowRight size={14} className="text-text-muted shrink-0" />
        <code className="text-sm font-mono text-success bg-success-light px-2 py-0.5 rounded">
          {output}
        </code>
      </div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-4 animate-fade-in">
          <h1 className="text-2xl font-bold text-text-primary">Guide</h1>
          <p className="text-sm text-text-secondary mt-1">
            Learn how to use FILLY to improve your Filipino writing
          </p>
        </div>

        {/* What FILLY Does */}
        <GuideSection
          icon={<BookOpen size={20} className="text-primary" />}
          title="What FILLY Does"
          delay={50}
        >
          <p>
            <strong>FILLY</strong> (Filipino Language Literacy Yield) is an AI-powered
            writing assistant designed specifically for the Filipino language. It helps
            you write clearer, more formal, and grammatically correct Filipino text.
          </p>
          <p>
            FILLY performs two main functions: <strong>Text Normalization</strong> and{' '}
            <strong>Grammar Error Correction (GEC)</strong>. Together, they transform
            casual, internet-style Filipino text into polished, formal prose.
          </p>
        </GuideSection>

        {/* Normalization */}
        <GuideSection
          icon={<SpellCheck size={20} className="text-primary" />}
          title="Text Normalization"
          delay={100}
        >
          <p>
            FILLY detects and normalizes Filipino internet slang, chat abbreviations,
            SMS-style shorthand, and spelling variations. The normalization engine uses
            an N-gram rule generation algorithm based on the research paper:
          </p>
          <blockquote className="border-l-3 border-primary pl-4 py-1 my-3 text-xs italic text-text-muted">
            "Look Ma, Only 400 Samples! Revisiting the Effectiveness of Automatic
            N-Gram Rule Generation for Spelling Normalization in Filipino"
            — Flores & Radev, EMNLP 2022
          </blockquote>
          <p>
            Non-standard words are <span className="normalization-mark">underlined in red</span>.
            Hover over them to see the suggested correction.
          </p>
          <ExampleBox input="aq" output="ako" label="Examples" />
          <ExampleBox input="nmn" output="naman" />
          <ExampleBox input="musta" output="kamusta" />
          <ExampleBox input="u" output="ikaw" />
        </GuideSection>

        {/* Grammar Correction */}
        <GuideSection
          icon={<AlertTriangle size={20} className="text-primary" />}
          title="Grammar Error Correction"
          delay={150}
        >
          <p>
            The GEC module detects grammatical errors in Filipino text using a
            GECToR-style architecture powered by RoBERTa Tagalog Large. It identifies
            issues such as:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Subject-verb agreement errors</li>
            <li>Missing pluralization markers (mga)</li>
            <li>Particle errors (na/ng, nang/ng)</li>
            <li>Linker errors (-ng vs na)</li>
            <li>Aspect consistency issues</li>
          </ul>
          <p>
            Grammar issues are <span className="grammar-mark">underlined in blue</span> and
            appear as recommendations in the right panel.
          </p>
        </GuideSection>

        {/* How Suggestions Work */}
        <GuideSection
          icon={<Lightbulb size={20} className="text-primary" />}
          title="How Suggestions Work"
          delay={200}
        >
          <p>When FILLY detects an issue, it appears in two places:</p>
          <div className="space-y-2 mt-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <p>
                <strong>In the editor:</strong> The problematic text is underlined.
                Hover over it to see the suggestion in a tooltip.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <p>
                <strong>In the Recommendations panel:</strong> Each suggestion shows
                the original text, the correction, and two buttons.
              </p>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-border-light mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-success" />
              <span>
                <strong>Accept</strong> — Replaces the text in the editor with the
                correction immediately.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-error" />
              <span>
                <strong>Ignore</strong> — Dismisses the suggestion. The recommendation
                disappears from the panel.
              </span>
            </div>
          </div>
        </GuideSection>

        {/* Privacy Policy */}
        <GuideSection
          icon={<Shield size={20} className="text-primary" />}
          title="Privacy Policy"
          delay={250}
        >
          <p>
            FILLY processes your text locally on the server you deploy it to. Your
            documents are stored in a local database and are never shared with
            third-party services.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>All NLP processing happens on your own infrastructure</li>
            <li>No text is sent to external APIs</li>
            <li>Documents are stored in your local database only</li>
            <li>You can delete your documents at any time</li>
            <li>No analytics or tracking data is collected</li>
          </ul>
        </GuideSection>
      </div>
    </div>
  );
}
