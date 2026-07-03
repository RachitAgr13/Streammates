import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket } from '@/services/socket';
import type { ConnectionStatus, PresenceMember } from '@/types/socket';
import type { RoomMember } from '@/types/room';

interface UseRoomSocketOptions {
  roomCode: string;
  guestId: string | undefined;
  enabled?: boolean;
  onMembersSync?: (members: RoomMember[], memberCount: number) => void;
}

interface UseRoomSocketReturn {
  connectionStatus: ConnectionStatus;
  onlineGuestIds: Set<string>;
  socketError: string | null;
  onlineCount: number;
}

export function useRoomSocket({
  roomCode,
  guestId,
  enabled = true,
  onMembersSync,
}: UseRoomSocketOptions): UseRoomSocketReturn {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [onlineGuestIds, setOnlineGuestIds] = useState<Set<string>>(new Set());
  const [socketError, setSocketError] = useState<string | null>(null);
  const onMembersSyncRef = useRef(onMembersSync);

  onMembersSyncRef.current = onMembersSync;

  const handleMembersSync = useCallback(
    (members: RoomMember[], memberCount: number) => {
      onMembersSyncRef.current?.(members, memberCount);
    },
    [],
  );

  useEffect(() => {
    if (!enabled || !roomCode || !guestId) return;

    const socket = getSocket();
    setConnectionStatus('connecting');
    setSocketError(null);

    const joinRoom = () => {
      socket.emit('room:join', { roomCode: roomCode.toUpperCase(), guestId });
    };

    const onConnect = () => {
      setConnectionStatus('connected');
      joinRoom();
    };

    const onDisconnect = () => {
      setConnectionStatus('disconnected');
    };

    const onConnectError = () => {
      setConnectionStatus('error');
      setSocketError('Unable to connect to room server');
    };

    const onRoomJoined = (data: { onlineGuestIds: string[] }) => {
      setOnlineGuestIds(new Set(data.onlineGuestIds));
    };

    const onPresenceSync = (data: { onlineGuestIds: string[] }) => {
      setOnlineGuestIds(new Set(data.onlineGuestIds));
    };

    const onMemberOnline = (member: PresenceMember) => {
      setOnlineGuestIds((prev) => new Set([...prev, member.guestId]));
    };

    const onMemberOffline = (data: { guestId: string }) => {
      setOnlineGuestIds((prev) => {
        const next = new Set(prev);
        next.delete(data.guestId);
        return next;
      });
    };

    const onMembersSync = (data: {
      members: RoomMember[];
      memberCount: number;
    }) => {
      handleMembersSync(data.members, data.memberCount);
    };

    const onRoomError = (data: { message: string }) => {
      setSocketError(data.message);
      setConnectionStatus('error');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('room:joined', onRoomJoined);
    socket.on('presence:sync', onPresenceSync);
    socket.on('member:online', onMemberOnline);
    socket.on('member:offline', onMemberOffline);
    socket.on('room:members-sync', onMembersSync);
    socket.on('room:error', onRoomError);

    if (socket.connected) {
      joinRoom();
      setConnectionStatus('connected');
    } else {
      socket.connect();
    }

    return () => {
      socket.emit('room:leave');
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('room:joined', onRoomJoined);
      socket.off('presence:sync', onPresenceSync);
      socket.off('member:online', onMemberOnline);
      socket.off('member:offline', onMemberOffline);
      socket.off('room:members-sync', onMembersSync);
      socket.off('room:error', onRoomError);
      socket.disconnect();
      setConnectionStatus('idle');
      setOnlineGuestIds(new Set());
    };
  }, [roomCode, guestId, enabled, handleMembersSync]);

  return {
    connectionStatus,
    onlineGuestIds,
    socketError,
    onlineCount: onlineGuestIds.size,
  };
}
