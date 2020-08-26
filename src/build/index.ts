/// <reference path="../torch.d.ts" />

import compile from "./compile";
import renderCompile from "./renderCompile";
import copyPublic from "./copyPublic";
import { mergeConfig } from "../config";
import { rmTorchProjectFiles } from "../utils";
import type { TorchConfig } from "../index";

export default function build(draftConfig: TorchConfig) {
  const config = mergeConfig(draftConfig);

  // remove before
  rmTorchProjectFiles(config.dir);

  renderCompile(config)
    .then(() => compile(config))
    .then(() => copyPublic(config.dir))
    .then(() => console.info("Compile finish!"))
    .then(() => process.exit())
    .catch((err) => {
      console.log(err);
      throw err;
    });
}
