import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";
import chalk from "chalk";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const validationError = fromError(err);
    console.warn(
      chalk.yellow.bold("⚠️ Validation Error: ") + validationError.toString(),
      chalk.yellow("Errors:"), err.errors,
      chalk.yellow("Stack:"), err.stack?.split("\n")[0] || null,
    );
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

  const errorStack = err?.stack?.split("\n")[0] || null;
  const errorMessage = err?.message;
  const errorName = err?.name;
  const errorCode = err?.code;

  console.error(
    chalk.red.bold("❌ Internal Server Error:") + "\n" +
    chalk.red("Stack Trace: ") + chalk.gray(errorStack) + "\n" +
    chalk.red("Message: ") + chalk.yellow(errorMessage) + "\n" +
    chalk.red("Name: ") + chalk.cyan(errorName) + "\n" +
    chalk.red("Code: ") + chalk.magenta(errorCode) + "\n" +
    chalk.red("Full Error Object: ") + chalk.gray(JSON.stringify(err, null, 2))
  );
  res.status(500).json({
    status: false,
    date: new Date(),
    message: "Internal Server Error",
    stacks: errorStack,
    error: errorMessage,
    type: errorName,
  });
  return;
};
