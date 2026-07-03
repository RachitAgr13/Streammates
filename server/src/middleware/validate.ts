import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      next(result.error);
      return;
    }

    if ('body' in result.data && result.data.body) {
      req.body = result.data.body;
    }
    if ('params' in result.data && result.data.params) {
      req.params = { ...req.params, ...result.data.params };
    }
    if ('query' in result.data && result.data.query) {
      req.query = { ...req.query, ...result.data.query };
    }

    next();
  };
}

export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
