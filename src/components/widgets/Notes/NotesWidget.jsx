import React, { useState } from 'react';
import {
  FileText,
  Eye,
  Edit3,
  Copy,
  Check,
  Trash2,
  Plus,
  Sparkles,
  Save
} from 'lucide-react';
import WidgetCard from '../../common/WidgetCard';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    title: 'Scratchpad',
    content: `# Project Focus Notes 🚀\n- [x] Integrate Weather & Todo Widgets\n- [ ] Fine-tune procedural soundscapes\n- [ ] Configure GitHub CI workflow\n\n> "Simplicity is the soul of efficiency."\n\n\`\`\`js\nconst status = 'Vibe coding active';\n\`\`\``
  },
  {
    id: 'note-2',
    title: 'Architecture Ideas',
    content: `## Architecture Principles\n1. **Modularity**: Self-contained React components\n2. **Zero Hard Dependencies**: Graceful fallbacks\n3. **Performance**: Zero lag localStorage sync`
  }
];

// Simple lightweight Markdown renderer
function renderMarkdown(content) {
  if (!content) return null;
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-xs text-white/90 leading-relaxed font-sans">
      {lines.map((line, idx) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-base font-bold text-white border-b border-white/10 pb-1">{line.replace('# ', '')}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-sm font-bold text-theme-primary">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-xs font-semibold text-theme-accent">{line.replace('### ', '')}</h3>;
        }
        // Blockquotes
        if (line.startsWith('> ')) {
          return (
            <blockquote key={idx} className="border-l-2 border-theme-primary pl-2 italic text-theme-text-muted">
              {line.replace('> ', '')}
            </blockquote>
          );
        }
        // Checklist
        if (line.startsWith('- [x] ') || line.startsWith('- [ ] ')) {
          const checked = line.startsWith('- [x] ');
          const text = line.replace(/- \[[ x]\] /, '');
          return (
            <div key={idx} className="flex items-center space-x-2">
              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                checked ? 'bg-theme-success border-theme-success text-white' : 'border-white/30'
              }`}>
                {checked && '✓'}
              </span>
              <span className={checked ? 'line-through text-theme-text-muted' : ''}>{text}</span>
            </div>
          );
        }
        // Unordered list
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1">
              <span className="text-theme-primary font-bold">•</span>
              <span>{line.substring(2)}</span>
            </div>
          );
        }
        // Code blocks
        if (line.startsWith('```')) {
          return null; // Simple inline wrapper handles code
        }
        if (line.trim() === '') {
          return <div key={idx} className="h-1" />;
        }
        return <p key={idx}>{line}</p>;
      })}
    </div>
  );
}

export default function NotesWidget() {
  const [notes, setNotes] = useLocalStorage('perdash_notes', DEFAULT_NOTES);
  const [activeNoteId, setActiveNoteId] = useState('note-1');
  const [isPreview, setIsPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleUpdateContent = (newContent) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, content: newContent } : n))
    );
  };

  const handleAddNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: `Note ${notes.length + 1}`,
      content: '# New Scratchpad Note\nWrite your thoughts here...'
    };
    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id, e) => {
    e.stopPropagation();
    if (notes.length <= 1) return;
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    setActiveNoteId(remaining[0].id);
  };

  const handleCopy = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = activeNote?.content.trim().split(/\s+/).filter(Boolean).length || 0;
  const charCount = activeNote?.content.length || 0;

  return (
    <WidgetCard
      id="notes"
      title="Markdown Scratchpad"
      icon={FileText}
      badge={`${wordCount} words • ${charCount} chars`}
      badgeVariant="primary"
      actions={
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`p-1.5 rounded-lg border transition-all ${
              isPreview
                ? 'bg-theme-primary/20 text-theme-primary border-theme-primary/40'
                : 'text-theme-text-muted hover:text-theme-text border-transparent hover:bg-white/5'
            }`}
            title={isPreview ? 'Switch to Edit Mode' : 'Switch to Markdown Preview'}
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-white/5 transition-colors"
            title="Copy Note Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-theme-success" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleAddNote}
            className="p-1.5 rounded-lg bg-theme-primary/20 text-theme-primary hover:bg-theme-primary/30 border border-theme-primary/30 transition-all text-xs"
            title="New Note Sheet"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      {/* Note Tabs */}
      <div className="flex items-center space-x-1 pb-2 mb-3 border-b border-white/5 overflow-x-auto">
        {notes.map((n) => {
          const isActive = n.id === activeNoteId;
          return (
            <div
              key={n.id}
              onClick={() => setActiveNoteId(n.id)}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 cursor-pointer transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-theme-primary/20 text-theme-primary border border-theme-primary/30 font-medium'
                  : 'text-theme-text-muted hover:text-theme-text hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{n.title}</span>
              {notes.length > 1 && (
                <button
                  onClick={(e) => handleDeleteNote(n.id, e)}
                  className="hover:text-theme-danger p-0.5 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Editor / Preview Pane */}
      <div className="flex-1 min-h-[160px] max-h-72 overflow-y-auto">
        {isPreview ? (
          <div className="p-3 rounded-2xl bg-black/20 border border-white/5 min-h-[160px]">
            {renderMarkdown(activeNote?.content)}
          </div>
        ) : (
          <textarea
            value={activeNote?.content || ''}
            onChange={(e) => handleUpdateContent(e.target.value)}
            placeholder="Type your markdown notes, code snippets, or thoughts here..."
            className="w-full h-full min-h-[160px] p-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-theme-text-muted outline-none focus:border-theme-primary/40 resize-none transition-colors"
          />
        )}
      </div>

      {/* Auto-save footer note */}
      <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-theme-text-muted">
        <span className="flex items-center space-x-1">
          <Save className="w-3 h-3 text-theme-success mr-1" />
          <span>Auto-saved to local storage</span>
        </span>
        <span className="font-mono text-theme-primary">Markdown Enabled</span>
      </div>
    </WidgetCard>
  );
}
