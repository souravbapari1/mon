import express from "express";

// Define allowed keys
type AllowedKeys =
  | "params"
  | "query"
  | "body"
  | "headers"
  | "cookies"
  | "signedCookies"
  | "response";

// Ensure T only has the allowed keys
export type REQ<T extends Partial<Record<AllowedKeys, any>>> = T;

export const httpRequest = <T extends Partial<Record<AllowedKeys, any>>>(
  handler: (
    req: express.Request<T["params"], T["response"], T["body"], T["query"]> & {
      headers: T["headers"];
      cookies: T["cookies"];
      signedCookies: T["signedCookies"];
    },
    res: express.Response<T["response"]>,
    next: express.NextFunction
  ) => Promise<any> | any
) => {
  return (
    req: express.Request<T["params"], T["response"], T["body"], T["query"]> & {
      headers: T["headers"];
      cookies: T["cookies"];
      signedCookies: T["signedCookies"];
    },
    res: express.Response<T["response"]>,
    next: express.NextFunction
  ) => {
    try {
      const result = handler(req, res, next);
      if (result instanceof Promise) {
        result.catch(next);
      }
    } catch (error) {
      next(error);
    }
  };
};
