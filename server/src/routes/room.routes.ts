import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as roomController from '../controllers/room.controller.js';
import { asyncHandler, validate } from '../middleware/validate.js';
import { createRoomSchema, joinRoomSchema, roomCodeParamSchema } from '../validators/room.validator.js';

const router = Router();

const createRoomLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many rooms created. Please try again later.' },
});

router.post(
  '/',
  createRoomLimiter,
  validate(createRoomSchema),
  asyncHandler(roomController.createRoom),
);

router.get(
  '/:code',
  validate(roomCodeParamSchema),
  asyncHandler(roomController.getRoom),
);

router.post(
  '/:code/join',
  validate(joinRoomSchema),
  asyncHandler(roomController.joinRoom),
);

export default router;
