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


export const middleware = <T extends Partial<Record<AllowedKeys, any>>>(
  handler: (
    req: express.Request<T["params"], any, T["body"], T["query"]> & {
      headers: T["headers"];
      cookies: T["cookies"];
      signedCookies: T["signedCookies"];
    },
    res: express.Response,
    next: express.NextFunction
  ) => Promise<void> | void
) => {
  return (
    req: express.Request<T["params"], any, T["body"], T["query"]> & {
      headers: T["headers"];
      cookies: T["cookies"];
      signedCookies: T["signedCookies"];
    },
    res: express.Response,
    next: express.NextFunction
  ) => {
    return handler(req, res, next);
  };
};
