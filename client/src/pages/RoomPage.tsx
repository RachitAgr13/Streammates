import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { ConnectionBadge } from '@/components/ui/ConnectionBadge';
import { useRoomSocket } from '@/hooks/useRoomSocket';
import { getRoom } from '@/services/roomService';
import { ApiError } from '@/services/api';
import { useGuestStore, useRoomStore } from '@/stores/useRoomStore';
import type { Room, RoomMember } from '@/types/room';

export function RoomPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const getSession = useGuestStore((s) => s.getSession);
  const setRoom = useRoomStore((s) => s.setRoom);
  const inviteLink = useRoomStore((s) => s.inviteLink);

  const [room, setLocalRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const roomCode = code?.toUpperCase() ?? '';
  const session = getSession(roomCode);

  const handleMembersSync = useCallback(
    (members: RoomMember[], memberCount: number) => {
      setLocalRoom((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, members, memberCount };
        setRoom(updated, inviteLink ?? undefined);
        return updated;
      });
    },
    [inviteLink, setRoom],
  );

  const { connectionStatus, onlineGuestIds, socketError, onlineCount } = useRoomSocket({
    roomCode,
    guestId: session?.guestId,
    enabled: !isLoading && !!session && !!room,
    onMembersSync: handleMembersSync,
  });

  useEffect(() => {
    if (!roomCode) return;

    async function loadRoom() {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await getRoom(roomCode);
        setLocalRoom(data.room);
        setRoom(data.room);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load room');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadRoom();
  }, [roomCode, setRoom]);

  useEffect(() => {
    if (!isLoading && !session && room) {
      navigate(`/join?code=${room.roomCode}`, { replace: true });
    }
  }, [isLoading, session, room, navigate]);

  async function copyInviteLink() {
    const link = inviteLink ?? `${window.location.origin}/room/${roomCode}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <PageLayout centered={false}>
        <div className="mx-auto flex max-w-6xl items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-violet border-t-transparent" />
        </div>
      </PageLayout>
    );
  }

  if (error || !room) {
    return (
      <PageLayout>
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Room not found</h1>
          <p className="mt-2 text-white/60">{error ?? 'This room may have expired.'}</p>
          <Link to="/" className="mt-6 inline-block text-accent-cyan hover:underline">
            Back to home
          </Link>
        </div>
      </PageLayout>
    );
  }

  const isHost = session?.guestId === room.hostGuestId;

  const sortedMembers = [...room.members].sort((a, b) => {
    const aOnline = onlineGuestIds.has(a.guestId) ? 0 : 1;
    const bOnline = onlineGuestIds.has(b.guestId) ? 0 : 1;
    if (aOnline !== bOnline) return aOnline - bOnline;
    if (a.role === 'host') return -1;
    if (b.role === 'host') return 1;
    return a.nickname.localeCompare(b.nickname);
  });

  return (
    <PageLayout centered={false}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{room.name}</h1>
              <ConnectionBadge status={connectionStatus} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-white/50">
              <span className="font-mono tracking-wider">{room.roomCode}</span>
              <span>·</span>
              <span>
                {onlineCount} online · {room.memberCount} total
              </span>
              {isHost && (
                <>
                  <span>·</span>
                  <span className="text-accent-violet">You are the host</span>
                </>
              )}
            </div>
            {socketError && (
              <p className="mt-2 text-sm text-red-400">{socketError}</p>
            )}
          </div>

          <Button variant="secondary" size="sm" onClick={copyInviteLink}>
            {copied ? 'Copied!' : 'Copy invite link'}
          </Button>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="overflow-hidden rounded-2xl glass-strong"
          >
            <div className="relative aspect-video bg-stream-900">
              {room.videoType === 'youtube' && room.videoSource ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="rounded-xl bg-stream-800 px-4 py-2 font-mono text-sm text-white/60">
                    YouTube: {room.videoSource}
                  </div>
                  <p className="text-sm text-white/40">Video player arrives in Milestone 4</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <PlayIcon />
                  <p className="text-white/50">No video selected yet</p>
                  {isHost && (
                    <p className="text-sm text-white/30">Paste a YouTube link to get started</p>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-white/5 p-4">
              <div className="flex items-center gap-4">
                <div className="h-1 flex-1 rounded-full bg-stream-700">
                  <div className="h-full w-0 rounded-full bg-accent-violet" />
                </div>
                <span className="text-xs text-white/40">0:00</span>
              </div>
              <p className="mt-3 text-center text-xs text-white/30">
                Playback sync coming in Milestone 4
              </p>
            </div>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl glass p-5"
            >
              <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white/50">
                Members · {onlineCount} online
              </h2>
              <ul className="space-y-2">
                {sortedMembers.map((member) => (
                  <MemberItem
                    key={member.guestId}
                    member={member}
                    isYou={member.guestId === session?.guestId}
                    isOnline={onlineGuestIds.has(member.guestId)}
                  />
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl glass p-5"
            >
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-white/50">
                Chat
              </h2>
              <div className="flex h-48 items-center justify-center rounded-xl bg-stream-900/50 text-sm text-white/30">
                Real-time chat in Milestone 5
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function MemberItem({
  member,
  isYou,
  isOnline,
}: {
  member: RoomMember;
  isYou: boolean;
  isOnline: boolean;
}) {
  const roleBadge =
    member.role === 'host' ? 'Host' : member.role === 'moderator' ? 'Mod' : null;

  return (
    <li
      className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/5 ${
        !isOnline ? 'opacity-50' : ''
      }`}
    >
      <div className="relative">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-violet/40 to-accent-cyan/40 text-xs font-bold">
          {member.nickname.charAt(0).toUpperCase()}
        </div>
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-stream-900 ${
            isOnline ? 'bg-green-400' : 'bg-white/20'
          }`}
          title={isOnline ? 'Online' : 'Offline'}
        />
      </div>
      <div className="min-w-0 flex-1">
        <span className="truncate text-sm font-medium">
          {member.nickname}
          {isYou && <span className="ml-1 text-white/40">(you)</span>}
        </span>
        {!isOnline && (
          <span className="block text-xs text-white/30">Offline</span>
        )}
      </div>
      {roleBadge && (
        <span className="rounded-md bg-accent-violet/20 px-2 py-0.5 text-xs text-accent-violet">
          {roleBadge}
        </span>
      )}
    </li>
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
