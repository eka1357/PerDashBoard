import React, { useState, useEffect } from 'react';
import {
  Quote,
  Sparkles,
  RefreshCw,
  Heart,
  Copy,
  Check,
  Share2,
  Bookmark,
  ChevronRight
} from 'lucide-react';
import WidgetCard from '../../common/WidgetCard';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

const QUOTES_DATABASE = [
  {
    id: 'q-1',
    text: 'The only way to do great work is to love what you do. If you haven’t found it yet, keep looking.',
    author: 'Steve Jobs',
    category: 'Tech'
  },
  {
    id: 'q-2',
    text: 'We suffer more often in imagination than in reality.',
    author: 'Seneca',
    category: 'Philosophy'
  },
  {
    id: 'q-3',
    text: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger W. Dijkstra',
    category: 'Tech'
  },
  {
    id: 'q-4',
    text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    author: 'James Clear',
    category: 'Growth'
  },
  {
    id: 'q-5',
    text: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    category: 'Mindfulness'
  },
  {
    id: 'q-6',
    text: 'The best error message is the one that never shows up.',
    author: 'Thomas Fuchs',
    category: 'Tech'
  },
  {
    id: 'q-7',
    text: 'Waste no more time arguing what a good man should be. Be one.',
    author: 'Marcus Aurelius',
    category: 'Philosophy'
  },
  {
    id: 'q-8',
    text: 'Focus is a muscle. The more you protect it, the stronger your craft becomes.',
    author: 'Deep Work Philosophy',
    category: 'Growth'
  },
  {
    id: 'q-9',
    text: 'Code is like humor. When you have to explain it, it’s bad.',
    author: 'Cory House',
    category: 'Tech'
  }
];

const CATEGORIES = ['All', 'Tech', 'Philosophy', 'Growth', 'Mindfulness'];

export default function QuotesWidget() {
  const [favorites, setFavorites] = useLocalStorage('perdash_favorite_quotes', ['q-1', 'q-4']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredQuotes = QUOTES_DATABASE.filter((q) => {
    if (showFavoritesOnly) return favorites.includes(q.id);
    return selectedCategory === 'All' || q.category === selectedCategory;
  });

  const currentQuote = filteredQuotes[currentIndex % Math.max(1, filteredQuotes.length)] || QUOTES_DATABASE[0];
  const isFavorite = favorites.includes(currentQuote?.id);

  const handleNextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredQuotes.length);
  };

  const handleToggleFavorite = () => {
    if (!currentQuote) return;
    if (isFavorite) {
      setFavorites(favorites.filter((id) => id !== currentQuote.id));
    } else {
      setFavorites([...favorites, currentQuote.id]);
    }
  };

  const handleCopy = () => {
    if (!currentQuote) return;
    const textToCopy = `"${currentQuote.text}" — ${currentQuote.author}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <WidgetCard
      id="quotes"
      title="Daily Wisdom"
      icon={Quote}
      badge={currentQuote?.category || 'Wisdom'}
      badgeVariant="primary"
      onRefresh={handleNextQuote}
      actions={
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`p-1.5 rounded-lg border transition-all ${
              showFavoritesOnly
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'text-theme-text-muted hover:text-theme-text border-transparent hover:bg-white/5'
            }`}
            title="Show Saved Favorites"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      {/* Category Pills */}
      {!showFavoritesOnly && (
        <div className="flex flex-wrap items-center gap-1 mb-4 pb-2 border-b border-white/5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] transition-all font-medium ${
                selectedCategory === cat
                  ? 'bg-theme-primary/20 text-theme-primary border border-theme-primary/30'
                  : 'text-theme-text-muted hover:text-theme-text hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Main Quote Card */}
      <div className="flex-1 flex flex-col justify-between py-2 min-h-[140px]">
        <div className="relative">
          <Quote className="w-8 h-8 text-theme-primary/20 absolute -top-3 -left-2 transform -scale-x-100 pointer-events-none" />
          <p className="relative z-10 text-sm sm:text-base font-serif italic text-white/90 leading-relaxed pl-4">
            "{currentQuote?.text}"
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="text-xs font-semibold text-theme-primary tracking-wide">
            — {currentQuote?.author}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-xl text-theme-text-muted hover:text-theme-text hover:bg-white/5 transition-colors"
              title="Copy quote"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-theme-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-xl transition-all ${
                isFavorite
                  ? 'text-rose-400 hover:text-rose-300'
                  : 'text-theme-text-muted hover:text-rose-400 hover:bg-white/5'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
            </button>

            <button
              onClick={handleNextQuote}
              className="p-1.5 rounded-xl bg-theme-primary/10 text-theme-primary hover:bg-theme-primary/20 transition-all flex items-center space-x-1 text-xs"
              title="Next quote"
            >
              <span className="text-[10px] hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
