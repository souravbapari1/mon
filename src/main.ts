import express from "express";
import { Logger } from "./core/logger.handler";
import { errorHandler } from "./core/error.handler";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";

type MonApp = {
  middleware?: any[];
  express?: (
    app: express.Express,
    httpServer: Server<typeof IncomingMessage, typeof ServerResponse>
  ) => void;
  routes: express.Router;
  extraRoutes?: express.Router;
};

export const MonPress = (data: MonApp) => {
  const app = express();
  const httpServer = createServer(app);

  if (data?.express) {
    data.express(app, httpServer);
  }
  if (data?.middleware && data?.middleware.length > 0) {
    app.use(...data?.middleware);
  }
  app.use(Logger);
  app.use(data.routes);
  if (data?.extraRoutes) {
    app.use(data.extraRoutes);
  }
  app.use(errorHandler);
  return httpServer;
};

export * from "./core/http.handler";
export * from "./core/middleware.handler";
