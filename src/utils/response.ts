import { Response } from 'express';

export function success(
  res: Response,
  statusCode: number,
  message: string,
  data: unknown = null,
  meta: object = {},
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
}

export function error(
  res: Response,
  statusCode: number,
  message: string,
  errors: Array<{ field?: string; message: string }> | null = null,
  meta: object = {},
) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    meta,
  });
}
