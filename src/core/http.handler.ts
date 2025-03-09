import express from "express";

export type RequestType = {
  params?: Record<string, any>;
  query?: Record<string, any>;
  body?: any;
  headers?: Record<string, any>;
  cookies?: Record<string, any>;
  signedCookies?: Record<string, any>;
  response?: any;
};

export const httpRequest = <T extends RequestType>(
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
