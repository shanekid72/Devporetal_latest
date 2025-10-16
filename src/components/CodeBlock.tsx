
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import clsx from "clsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, CheckCircle } from "lucide-react";
import { CodeExample, Theme } from "../types";

interface CodeBlockProps {
  code?: string;
  language?: string;
  theme?: Theme;
  showLineNumbers?: boolean;
  fileName?: string;
  examples?: CodeExample[];
}

const FALLBACK_THEME: Theme = { mode: "light" };

const CodeBlock: React.FC<CodeBlockProps> = ({
  code = "",
  language = "javascript",
  theme,
  showLineNumbers = false,
  examples,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const resolvedTheme = theme ?? FALLBACK_THEME;
  
  // Always use dark theme for code syntax highlighting with enhanced visibility
  const darkHighlightTheme = useMemo(
    () => ({
      ...vscDarkPlus,
      'pre[class*="language-"]': {
        ...(vscDarkPlus['pre[class*="language-"]'] ?? {}),
        background: 'transparent',
        color: '#F1F5F9',
      },
      'code[class*="language-"]': {
        ...(vscDarkPlus['code[class*="language-"]'] ?? {}),
        background: 'transparent',
        color: '#F1F5F9',
      },
      'comment': {
        color: '#7C8B99',
        fontStyle: 'italic',
      },
      'string': {
        color: '#7ee787',
      },
      'keyword': {
        color: '#ff7b72',
      },
      'function': {
        color: '#d2a8ff',
      },
      'operator': {
        color: '#F1F5F9',
      },
      'punctuation': {
        color: '#F1F5F9',
      },
      'property': {
        color: '#79c0ff',
      },
      'number': {
        color: '#79c0ff',
      },
      'boolean': {
        color: '#79c0ff',
      },
      'constant': {
        color: '#79c0ff',
      },
      'class-name': {
        color: '#ffa657',
      },
    }),
    []
  );

  // Always use dark syntax theme for code blocks
  const syntaxTheme = darkHighlightTheme;
  const isDark = resolvedTheme.mode === 'dark';

  // ALWAYS use dark background for code area regardless of theme - code is more readable on dark
  const codeAreaStyle = useMemo<CSSProperties>(
    () => ({
      background: '#0d1117', // GitHub dark background - solid, no transparency
      minHeight: '200px',
    }),
    []
  );
  const exampleKey = useMemo(() => {
    if (!examples) {
      return "";
    }
    return examples.map((ex) => `${ex.language}:${ex.label}:${ex.code.length}`).join("|");
  }, [examples]);

  const hasExamples = Array.isArray(examples) && examples.length > 0;
  const safeIndex = hasExamples ? Math.min(activeIndex, examples.length - 1) : 0;
  const activeExample = hasExamples ? examples[safeIndex] : undefined;
  const activeLanguage = activeExample?.language ?? language;
  const activeCode = activeExample?.code ?? code;

  useEffect(() => {
    setActiveIndex(0);
  }, [exampleKey, hasExamples]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code", error);
    }
  };

  const getLanguageLabel = (lang: string): string => {
    switch (lang.toLowerCase()) {
      case "js":
      case "javascript":
        return "JavaScript";
      case "ts":
      case "typescript":
        return "TypeScript";
      case "py":
      case "python":
        return "Python";
      case "rb":
      case "ruby":
        return "Ruby";
      case "go":
        return "Go";
      case "java":
        return "Java";
      case "csharp":
      case "cs":
        return "C#";
      case "php":
        return "PHP";
      case "bash":
      case "sh":
        return "Shell";
      case "json":
        return "JSON";
      case "xml":
        return "XML";
      case "yaml":
      case "yml":
        return "YAML";
      default:
        return lang.charAt(0).toUpperCase() + lang.slice(1);
    }
  };

  const containerClasses = clsx(
    "relative overflow-hidden rounded-2xl border shadow-lg transition-colors",
    isDark
      ? "border-slate-700/60 bg-slate-900/50 shadow-slate-950/40"
      : "border-slate-200/80 bg-white shadow-slate-300/30"
  );

  const headerClasses = clsx(
    "flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b",
    isDark ? "border-slate-700/60 bg-slate-800/80" : "border-slate-200/70 bg-slate-50/80"
  );

  const badgeClasses = clsx(
    "text-xs px-2 py-1 rounded-lg border font-medium",
    isDark ? "border-slate-600 text-slate-200 bg-slate-800/80" : "border-slate-300 text-slate-700 bg-slate-100"
  );

  return (
    <div className={containerClasses}>
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 -left-20 h-44 w-44 blur-3xl bg-sky-500/15" />
        <div className="absolute -bottom-28 right-[-12%] h-56 w-56 blur-3xl bg-violet-500/15" />
      </div>

      <div className={clsx(headerClasses, "relative z-20 backdrop-blur-sm")}>
        <div className="flex items-center gap-2">
          <span className={badgeClasses}>{getLanguageLabel(activeLanguage)}</span>
        </div>
        {hasExamples && (
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => {
              const isActive = index === safeIndex;
              return (
                <button
                  key={`${example.language}-${example.label}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={clsx(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white shadow-md"
                      : isDark
                        ? "bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-slate-500"
                        : "bg-white text-slate-600 border border-slate-300 hover:border-slate-400"
                  )}
                >
                  {example.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative z-10" style={codeAreaStyle}>
        {/* Terminal-style window controls */}
        <div className="pointer-events-none absolute top-4 left-5 flex items-center gap-2 z-30">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>

        {/* Code content */}
        <div className="relative z-10">
          <SyntaxHighlighter
            language={activeLanguage}
            style={syntaxTheme}
            showLineNumbers={showLineNumbers}
            wrapLongLines
            customStyle={{
              margin: 0,
              background: "#0d1117",
              padding: "1.75rem",
              paddingTop: "2.5rem",
              fontSize: "0.875rem",
              lineHeight: "1.7",
              color: "#e6edf3",
              fontWeight: "400",
              minHeight: "200px",
            }}
            codeTagProps={{
              style: {
                fontFamily:
                  'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                color: "#e6edf3",
              },
            }}
          >
            {activeCode}
          </SyntaxHighlighter>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 z-30 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-all bg-slate-700 text-white hover:bg-slate-600 border border-slate-600"
          title="Copy code"
        >
          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default CodeBlock;



