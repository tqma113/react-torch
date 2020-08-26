import path from "path";
import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import favicon from "serve-favicon";
import helmet from "helmet";
import bodyParser from "body-parser";

export default function createServer(dir: string) {
  const app = express();

  // helmet
  app.use(helmet());

  // compression
  app.use(compression());

  // favicon
  const favPath = path.join(dir, "public", "favicon.ico");
  app.use(favicon(favPath));

  // logger
  app.use(logger("common"));

  // body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // cookie parser
  app.use(cookieParser("__TORCH__"));

  return app;
}
