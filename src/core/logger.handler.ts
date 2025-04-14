import chalk from "chalk";
import type { NextFunction, Request, Response } from "express";

export const Logger = (req: Request, res: Response, next: NextFunction): void => {
  if (req.path.startsWith("/favicon")) {
    return next();
  }

  const start = process.hrtime();

  // Collect useful info
  const method = chalk.green(req.method);
  const url = chalk.cyan(req.originalUrl);
  const timestamp = chalk.gray(new Date().toISOString());

  const query = Object.keys(req.query).length
    ? chalk.magenta(`? ${JSON.stringify(req.query)}`)
    : "";

  const params = Object.keys(req.params).length
    ? chalk.yellow(`params: ${JSON.stringify(req.params)}`)
    : "";

  // Log the request
  console.log(`${timestamp} ${method} ${url}`);
  if (query) console.log(`   ↳ ${query}`);
  if (params) console.log(`   ↳ ${params}`);

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const time = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(1); // ms

    const statusColor =
      res.statusCode >= 500
        ? chalk.red
        : res.statusCode >= 400
          ? chalk.yellow
          : chalk.green;

    console.log(
      `${chalk.gray("   ↳")} ${statusColor(res.statusCode)} ${chalk.white(`(${time} ms)`)}`
    );
  });

  next();
};
