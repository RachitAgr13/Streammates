import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createRoom } from '@/services/roomService';
import { ApiError } from '@/services/api';
import { useGuestStore, useRoomStore } from '@/stores/useRoomStore';

export function CreateRoomPage() {
  const navigate = useNavigate();
  const setSession = useGuestStore((s) => s.setSession);
  const setRoom = useRoomStore((s) => s.setRoom);

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        nickname: nickname.trim(),
        ...(youtubeUrl.trim()
          ? { videoType: 'youtube' as const, videoSource: youtubeUrl.trim() }
          : {}),
      };

      const { data } = await createRoom(payload);

      setSession(data.room.roomCode, data.guestId, nickname.trim());
      setRoom(data.room, data.inviteLink);
      navigate(`/room/${data.room.roomCode}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.errors) {
          const mapped: Record<string, string> = {};
          for (const [key, messages] of Object.entries(err.errors)) {
            if (messages[0]) mapped[key.replace('body.', '')] = messages[0];
          }
          setFieldErrors(mapped);
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold">Create a Room</h1>
          <p className="mt-2 text-white/60">Start a watch party in seconds — no account needed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl glass-strong p-8">
          <Input
            label="Room name"
            placeholder="Friday Movie Night"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
            required
            maxLength={80}
          />

          <Input
            label="Your nickname"
            placeholder="Alex"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            error={fieldErrors.nickname}
            required
            maxLength={30}
          />

          <Input
            label="YouTube URL (optional)"
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            error={fieldErrors.videoSource}
            hint="Add a video now or choose one inside the room later."
          />

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" glow disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Room'}
          </Button>
        </form>
      </motion.div>
    </PageLayout>
  );
}
