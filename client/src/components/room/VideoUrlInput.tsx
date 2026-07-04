import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { extractYouTubeVideoId } from '@/utils/youtube';

interface VideoUrlInputProps {
  onLoad: (urlOrId: string) => void;
  currentVideoId?: string | null;
}

export function VideoUrlInput({ onLoad, currentVideoId }: VideoUrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) return;

    if (!extractYouTubeVideoId(trimmed)) {
      setError('Enter a valid YouTube URL or video ID');
      return;
    }

    onLoad(trimmed);
    setUrl('');
  }

  return (
    <form onSubmit={handleSubmit} className="border-b border-white/5 p-4">
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
        {currentVideoId ? 'Change video' : 'Load YouTube video'}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="min-w-0 flex-1 rounded-xl glass px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-accent-violet/20"
        />
        <Button type="submit" size="sm" variant="secondary">
          Load
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </form>
  );
}
