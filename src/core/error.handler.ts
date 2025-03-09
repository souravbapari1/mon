import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const validationError = fromError(err);
    res.status(400).json({
      status: false,
      date: new Date(),
      message: validationError.toString(),
      errors: err.errors,
      stack: err.stack?.split("\n")[0] || null,
      type: err?.name,
    });
    return;
  }
  res.status(500).json({
    status: false,
    date: new Date(),
    message: "Internal Server Error",
    stacks: err?.stack?.split("\n")[0] || null,
    error: err?.message,
    type: err?.name,
  });
  return;
};
