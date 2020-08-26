import path from "path";
import { hasModuleFile } from "../utils";
import type { Server } from "http";
import type { Application } from "express";
import type { TorchConfig, Mdlw } from "../index";

export default function attachMiddleware(
  app: Application,
  server: Server,
  config: Required<TorchConfig>
) {
  if (config.mdlw) {
    const middlewarePath = path.resolve(
      config.dir,
      ".torch",
      "server",
      "mdlw.js"
    );

    if (hasModuleFile(middlewarePath)) {
      const middlewares: Record<string, Mdlw> = require(middlewarePath);

      Object.keys(middlewares).forEach((key) => {
        let middleware = middlewares[key];

        if (typeof middleware === "function") {
          middleware(app, server);
        } else {
          console.warn(`The middelware: ${middleware} is not a function`);
        }
      });
    } else {
      console.warn(`The middelware module: ${config.mdlw} is invalid`);
    }
  }
}
