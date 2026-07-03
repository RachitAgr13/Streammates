import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { joinRoom } from '@/services/roomService';
import { ApiError } from '@/services/api';
import { useGuestStore, useRoomStore } from '@/stores/useRoomStore';

export function JoinRoomPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const getSession = useGuestStore((s) => s.getSession);
  const setSession = useGuestStore((s) => s.setSession);
  const setRoom = useRoomStore((s) => s.setRoom);

  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      setCode(codeParam.toUpperCase());
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    const roomCode = code.trim().toUpperCase();
    const existingSession = getSession(roomCode);

    try {
      const { data } = await joinRoom(roomCode, {
        nickname: nickname.trim(),
        guestId: existingSession?.guestId,
      });

      setSession(data.room.roomCode, data.guestId, data.member.nickname);
      setRoom(data.room);
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
          <h1 className="font-display text-3xl font-bold">Join a Room</h1>
          <p className="mt-2 text-white/60">Enter the 6-character code from your invite link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl glass-strong p-8">
          <Input
            label="Room code"
            placeholder="ABC123"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            error={fieldErrors.code}
            required
            maxLength={6}
            className="font-mono tracking-widest uppercase"
          />

          <Input
            label="Your nickname"
            placeholder="Sam"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            error={fieldErrors.nickname}
            required
            maxLength={30}
          />

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" glow disabled={isSubmitting}>
            {isSubmitting ? 'Joining...' : 'Join Room'}
          </Button>
        </form>
      </motion.div>
    </PageLayout>
  );
}
