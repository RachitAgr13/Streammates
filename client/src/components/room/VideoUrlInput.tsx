interface VideoUrlInputProps {
  onSubmit: (url: string) => void;
  disabled?: boolean;
}

export function VideoUrlInput({ onSubmit, disabled }: VideoUrlInputProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('videoUrl') as HTMLInputElement;
    const url = input.value.trim();
    if (!url) return;
    onSubmit(url);
    input.value = '';
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-stream-900/95 p-6"
    >
      <PlayIcon />
      <p className="text-center text-white/70">Paste a YouTube link to start watching</p>
      <div className="flex w-full max-w-md gap-2">
        <input
          name="videoUrl"
          type="text"
          placeholder="https://youtube.com/watch?v=..."
          disabled={disabled}
          className="flex-1 rounded-xl glass px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-accent-violet/30"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-xl bg-gradient-to-r from-accent-violet to-accent-purple px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Load
        </button>
      </div>
    </form>
  );
}

function PlayIcon() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
      <svg className="h-8 w-8 text-white/60" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}
