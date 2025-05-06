import { NextFunction, Request, Response } from "express";

type AllowedKeys =
  | "params"
  | "query"
  | "body"
  | "headers"
  | "cookies"
  | "signedCookies"
  | "response";

export type With<T extends Partial<Record<AllowedKeys, any>>> = Request<
  T["params"],
  T["response"],
  T["body"],
  T["query"]
> & {
  headers: T["headers"];
  cookies: T["cookies"];
  signedCookies: T["signedCookies"];
};

interface HttpRequestOptions {
  middlewares?: (
    | ((req: With<any>, res: Response<any>, next: NextFunction) => void)
  )[];
}

// Refactored httpRequest function to support middleware chaining
export const httpRequest = <T extends Partial<Record<AllowedKeys, any>>>(
  handler: (
    req: With<T>,
    res: Response<T["response"]>,
    next: NextFunction
  ) => Promise<any> | any,
  options?: HttpRequestOptions
) => {
  const middlewares = options?.middlewares || [];

  const wrappedHandler = (
    req: With<T>,
    res: Response<T["response"]>,
    next: NextFunction
  ) => {
    for (const middleware of middlewares) {
      middleware(req, res, next);
    }

    try {
      const result = handler(req, res, next);
      if (result instanceof Promise) {
        result.catch(next);
      }
    } catch (error) {
      next(error);
    }
  };

  // Adding .middleware() method to chain middlewares directly
  wrappedHandler.middleware = (
    middleware: (req: With<T>, res: Response<T["response"]>, next: NextFunction) => void
  ) => {
    middlewares.push(middleware);
    return wrappedHandler;
  };

  return wrappedHandler;
};
