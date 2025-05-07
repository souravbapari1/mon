import { NextFunction, Request, Response } from "express";

type AllowedKeys =
  | "params"
  | "query"
  | "body"
  | "headers"
  | "cookies"
  | "signedCookies"
  | "response";

// Extended request type with optional metadata
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

type Middleware<T extends Partial<Record<AllowedKeys, any>>> =
  | ((req: With<T>, res: Response<T["response"]>, next: NextFunction) => void)
  | ((req: With<T>, res: Response<T["response"]>, next: NextFunction) => Promise<void>);

// Type for handler with middleware chaining
interface ChainableHandler<T extends Partial<Record<AllowedKeys, any>>> {
  (req: With<T>, res: Response<T["response"]>, next: NextFunction): void;
  middleware(mw: Middleware<T>): ChainableHandler<T>;
}

// Main httpRequest builder
export const httpRequest = <T extends Partial<Record<AllowedKeys, any>>>(
  handler: (
    req: With<T>,
    res: Response<T["response"]>,
    next: NextFunction
  ) => Promise<any> | any
): ChainableHandler<T> => {
  const middlewares: Middleware<T>[] = [];

  // Define base function without casting
  const baseHandler = async (
    req: With<T>,
    res: Response<T["response"]>,
    next: NextFunction
  ) => {
    const chain = [...middlewares, handler];

    const runMiddlewareChain = async (index: number): Promise<void> => {
      if (index >= chain.length) return;

      const current = chain[index];
      let nextCalled = false;

      const wrappedNext: NextFunction = (err?: any) => {
        nextCalled = true;
        if (err) return next(err);
      };

      try {
        const result = current(req, res, wrappedNext);
        if (result instanceof Promise) {
          await result;
        }

        if (nextCalled) {
          await runMiddlewareChain(index + 1);
        }
      } catch (err) {
        next(err);
      }
    };

    await runMiddlewareChain(0);
  };

  // Use Object.assign to attach .middleware with type-safety
  const handlerWithMiddleware = Object.assign(baseHandler, {
    middleware(mw: Middleware<T>) {
      middlewares.push(mw);
      return handlerWithMiddleware;
    },
  });

  return handlerWithMiddleware;
};
