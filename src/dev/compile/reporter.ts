import type { Options, ReporterOptions } from "webpack-dev-middleware";

export default function reporter(
  middlewareOptions: Options,
  options: ReporterOptions
): void {
  const { log, state, stats } = options;
  if (state) {
    const displayStats = middlewareOptions.stats !== false;
    const statsString = stats ? stats.toString(middlewareOptions.stats) : "";

    if (displayStats && statsString.trim().length) {
      if (stats && stats.hasErrors()) {
        log.error(statsString);
      } else if (stats && stats.hasWarnings()) {
        log.warn(statsString);
      } else {
        log.info(statsString);
      }
    }

    let message = "Compiled successfully.";

    if (stats && stats.hasErrors()) {
      message = "Failed to compile.";
    } else if (stats && stats.hasWarnings()) {
      message = "Compiled with warnings.";
    }
    log.info(message);
  } else {
    log.info("Compiling...");
  }
}
