import express from "express";
import { RequestType } from "./http.handler";

export const middleware = <T extends RequestType>(
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
