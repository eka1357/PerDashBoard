import React, { useState } from 'react';
import {
  Bookmark,
  ExternalLink,
  Plus,
  Trash2,
  Search,
  Globe,
  Terminal,
  Code2,
  BookOpen,
  Cpu,
  Layers,
  FolderGit2
} from 'lucide-react';
import WidgetCard from '../../common/WidgetCard';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

const DEFAULT_LINKS = [
  { id: '1', title: 'GitHub', url: 'https://github.com', category: 'Dev', icon: 'FolderGit2' },
  { id: '2', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', category: 'Docs', icon: 'BookOpen' },
  { id: '3', title: 'Stack Overflow', url: 'https://stackoverflow.com', category: 'Dev', icon: 'Code2' },
  { id: '4', title: 'Tailwind CSS', url: 'https://tailwindcss.com/docs', category: 'Docs', icon: 'Layers' },
  { id: '5', title: 'Vite Guide', url: 'https://vitejs.dev', category: 'Docs', icon: 'Terminal' },
  { id: '6', title: 'Hugging Face', url: 'https://huggingface.co', category: 'AI', icon: 'Cpu' }
];

const SEARCH_ENGINES = [
  { id: 'google', name: 'Google', queryUrl: 'https://www.google.com/search?q=' },
  { id: 'github', name: 'GitHub', queryUrl: 'https://github.com/search?q=' },
  { id: 'mdn', name: 'MDN', queryUrl: 'https://developer.mozilla.org/en-US/search?q=' },
  { id: 'so', name: 'StackOverflow', queryUrl: 'https://stackoverflow.com/search?q=' }
];

const ICON_MAP = {
  FolderGit2,
  BookOpen,
  Code2,
  Layers,
  Terminal,
  Cpu,
  Globe
};

export default function QuickLinksWidget() {
  const [links, setLinks] = useLocalStorage('perdash_quicklinks', DEFAULT_LINKS);
  const [searchEngine, setSearchEngine] = useState('google');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('Dev');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleLaunchSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const engine = SEARCH_ENGINES.find((eng) => eng.id === searchEngine);
    const targetUrl = `${engine.queryUrl}${encodeURIComponent(searchQuery.trim())}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newLink = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url: formattedUrl,
      category: newCategory,
      icon: 'Globe'
    };

    setLinks([...links, newLink]);
    setNewTitle('');
    setNewUrl('');
    setShowAddForm(false);
  };

  const handleDeleteLink = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    setLinks(links.filter((l) => l.id !== id));
  };

  return (
    <WidgetCard
      id="quicklinks"
      title="Dev Quick Links"
      icon={Bookmark}
      badge={`${links.length} Bookmarks`}
      badgeVariant="primary"
      actions={
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 rounded-lg bg-theme-primary/20 text-theme-primary hover:bg-theme-primary/30 border border-theme-primary/30 transition-all text-xs flex items-center space-x-1"
          title="Add Bookmark"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">Add</span>
        </button>
      }
    >
      {/* Dev Multi-Engine Search Launcher */}
      <form onSubmit={handleLaunchSearch} className="mb-4">
        <div className="flex items-center rounded-2xl bg-white/5 border border-white/10 overflow-hidden focus-within:border-theme-primary/50 transition-colors">
          <select
            value={searchEngine}
            onChange={(e) => setSearchEngine(e.target.value)}
            className="bg-transparent px-2.5 py-2 text-xs font-semibold text-theme-primary border-r border-white/10 outline-none"
          >
            {SEARCH_ENGINES.map((eng) => (
              <option key={eng.id} value={eng.id} className="bg-slate-900 text-white">
                {eng.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder={`Search ${SEARCH_ENGINES.find((e) => e.id === searchEngine)?.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-theme-text-muted outline-none"
          />
          <button
            type="submit"
            className="p-2 text-theme-text-muted hover:text-theme-primary transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Add New Link Form */}
      {showAddForm && (
        <form onSubmit={handleAddLink} className="mb-4 p-3 rounded-2xl bg-black/30 border border-theme-border animate-slide-up space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Title (e.g. Next.js)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="p-2 rounded-xl bg-white/5 border border-theme-border text-xs text-theme-text outline-none"
              autoFocus
            />
            <input
              type="text"
              placeholder="URL (e.g. nextjs.org)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="p-2 rounded-xl bg-white/5 border border-theme-border text-xs text-theme-text outline-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="p-1.5 rounded-xl bg-theme-card border border-theme-border text-theme-text text-xs"
            >
              <option value="Dev">Dev</option>
              <option value="Docs">Docs</option>
              <option value="AI">AI</option>
              <option value="Tools">Tools</option>
            </select>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 rounded-xl text-xs text-theme-text-muted hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-theme-primary text-white"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
        {links.map((link) => {
          const IconComp = ICON_MAP[link.icon] || Globe;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-theme-primary/30 transition-all flex items-center justify-between group/link"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="p-1.5 rounded-xl bg-white/5 text-theme-primary group-hover/link:scale-105 transition-transform flex-shrink-0">
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{link.title}</div>
                  <div className="text-[10px] text-theme-text-muted">{link.category}</div>
                </div>
              </div>

              <div className="flex items-center space-x-1 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleDeleteLink(link.id, e)}
                  className="p-1 rounded-lg text-theme-text-muted hover:text-theme-danger hover:bg-theme-danger/10"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <ExternalLink className="w-3 h-3 text-theme-text-muted" />
              </div>
            </a>
          );
        })}
      </div>
    </WidgetCard>
  );
}
