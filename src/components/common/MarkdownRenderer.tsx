import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isUser = false }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isUser) {
    return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
  }

  // Parse lines and code blocks
  const parseBlocks = (text: string) => {
    const blocks: React.ReactNode[] = [];
    const lines = text.split('\n');
    let i = 0;
    let codeBlockIndex = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code Block start
      if (line.trim().startsWith('```')) {
        const lang = line.trim().slice(3).trim() || 'terminal';
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        const fullCode = codeLines.join('\n');
        const currentIndex = codeBlockIndex++;

        blocks.push(
          <div key={`code-${i}`} className="my-2.5 rounded-lg overflow-hidden border border-gray-800 bg-gray-900 shadow-sm text-left">
            <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 border-b border-gray-700 text-xs text-gray-400">
              <span className="font-mono flex items-center gap-1.5 text-gray-300">
                <Terminal className="w-3.5 h-3.5 text-gray-400" />
                {lang.toUpperCase()}
              </span>
              <button
                onClick={() => handleCopy(fullCode, currentIndex)}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                title="Salin script"
              >
                {copiedIndex === currentIndex ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 text-xs">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-xs">Salin</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 font-mono text-xs text-gray-200 overflow-x-auto leading-relaxed">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        i++;
        continue;
      }

      // Headings
      if (line.startsWith('### ')) {
        blocks.push(
          <h4 key={i} className="text-sm font-semibold text-gray-900 mt-3 mb-1 flex items-center gap-1.5">
            {renderInline(line.slice(4))}
          </h4>
        );
        i++;
        continue;
      }

      if (line.startsWith('## ')) {
        blocks.push(
          <h3 key={i} className="text-sm font-semibold text-gray-900 mt-3.5 mb-1.5 border-b border-gray-200 pb-1">
            {renderInline(line.slice(3))}
          </h3>
        );
        i++;
        continue;
      }

      if (line.startsWith('# ')) {
        blocks.push(
          <h2 key={i} className="text-base font-semibold text-gray-900 mt-4 mb-2">
            {renderInline(line.slice(2))}
          </h2>
        );
        i++;
        continue;
      }

      // Bullet List
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const listItems: string[] = [];
        while (i < lines.length && (lines[i].trim().startsWith('* ') || lines[i].trim().startsWith('- '))) {
          listItems.push(lines[i].trim().replace(/^[\*\-]\s+/, ''));
          i++;
        }
        blocks.push(
          <ul key={`ul-${i}`} className="space-y-1.5 my-2 pl-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                <span className="text-gray-400 font-bold mt-0.5 shrink-0">•</span>
                <span className="flex-1">{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Numbered List
      if (/^\d+\.\s/.test(line.trim())) {
        const listItems: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
          i++;
        }
        blocks.push(
          <ol key={`ol-${i}`} className="space-y-1.5 my-2 pl-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                <span className="font-medium text-gray-500 shrink-0">{idx + 1}.</span>
                <span className="flex-1">{renderInline(item)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Horizontal Rule
      if (line.trim() === '---' || line.trim() === '***' || line.trim() === '━━━━━━━━━━━━━━━━━━━━') {
        blocks.push(<hr key={i} className="my-3 border-gray-200" />);
        i++;
        continue;
      }

      // Normal Paragraph / Empty line
      if (line.trim() === '') {
        blocks.push(<div key={i} className="h-1.5" />);
      } else {
        blocks.push(
          <p key={i} className="text-sm text-gray-800 leading-relaxed my-1">
            {renderInline(line)}
          </p>
        );
      }
      i++;
    }

    return blocks;
  };

  // Helper to render bold (**text**), italic (*text*), and inline code (`code`)
  const renderInline = (str: string): React.ReactNode => {
    // Split by inline code `code`
    const parts = str.split(/(`[^`]+`)/g);

    return parts.map((part, pIdx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={pIdx}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-gray-100 border border-gray-200 font-mono text-xs text-gray-800"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Parse bold **text** and *italic*
      const boldParts = part.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**')) {
          return (
            <strong key={`${pIdx}-${bIdx}`} className="font-semibold text-gray-900">
              {bPart.slice(2, -2)}
            </strong>
          );
        }
        if (bPart.startsWith('*') && bPart.endsWith('*') && bPart.length > 2) {
          return (
            <em key={`${pIdx}-${bIdx}`} className="italic text-gray-700">
              {bPart.slice(1, -1)}
            </em>
          );
        }
        return bPart;
      });
    });
  };

  return <div className="space-y-1 text-left">{parseBlocks(content)}</div>;
};
