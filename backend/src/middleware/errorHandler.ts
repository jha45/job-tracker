import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
};
