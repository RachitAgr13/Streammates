interface ConnectionBadgeProps {
  status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
}

const statusConfig = {
  idle: { label: 'Idle', color: 'bg-white/30', pulse: false },
  connecting: { label: 'Connecting…', color: 'bg-yellow-400', pulse: true },
  connected: { label: 'Live', color: 'bg-green-400', pulse: true },
  disconnected: { label: 'Reconnecting…', color: 'bg-orange-400', pulse: true },
  error: { label: 'Offline', color: 'bg-red-400', pulse: false },
} as const;

export function ConnectionBadge({ status }: ConnectionBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/70">
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.color}`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${config.color}`} />
      </span>
      {config.label}
    </span>
  );
}
