import chalk from "chalk";
import type { NextFunction, Request, Response } from "express";

export const Logger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.path.startsWith("/favicon")) {
    next();
    return;
  }

  // Collect log content
  const logContent: string[] = [];

  // Request Information
  logContent.push(chalk.blue(` --> Incoming Request`));
  logContent.push(chalk.green(`Method: ${req.method}`)); // Green for method
  logContent.push(chalk.cyan(`Path: ${req.path}`)); // Cyan for path
  console.log(chalk.gray(`Timestamp: ${new Date().toISOString()}`));
  console.log(logContent.join("\n\n"));

  next();
};
