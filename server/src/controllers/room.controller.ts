import type { Request, Response } from 'express';
import * as roomService from '../services/room.service.js';
import type { CreateRoomInput, JoinRoomInput } from '../validators/room.validator.js';

export async function createRoom(req: Request, res: Response): Promise<void> {
  const input = req.body as CreateRoomInput;
  const result = await roomService.createRoom(input);

  res.status(201).json({
    success: true,
    data: result,
  });
}

export async function getRoom(req: Request, res: Response): Promise<void> {
  const code = req.params.code as string;
  const room = await roomService.getRoomByCode(code);

  res.status(200).json({
    success: true,
    data: { room },
  });
}

export async function joinRoom(req: Request, res: Response): Promise<void> {
  const code = req.params.code as string;
  const input = req.body as JoinRoomInput;
  const result = await roomService.joinRoom(code, input);

  res.status(200).json({
    success: true,
    data: result,
  });
}
