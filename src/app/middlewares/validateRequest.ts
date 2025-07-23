import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import xss from 'xss';
import { error } from '../../utils/response';

function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') return xss(value);
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (typeof value === 'object' && value !== null) {
    const sanitizedObj: Record<string, unknown> = {};
    for (const key in value) {
      sanitizedObj[key] = sanitizeValue((value as any)[key]);
    }
    return sanitizedObj;
  }
  return value;
}

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Sanitize body
    if (req.body) {
      req.body = sanitizeValue(req.body);
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formattedErrors = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      error(res, 400, 'Validate failed', formattedErrors);
    }

    req.body = result.data; // validated & sanitized
    next();
  };
}
