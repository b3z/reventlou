import * as config from "config";
import { log } from "./logger";

const configs = [
    "index.words",
    "index.chars",
    "search.words",
    "search.chars",
    "file.archive",
    "log.path",
    "log.silent",
];

/**
 * Validate if config file is not broken.
 */
export function isValid(): boolean {
    // eslint-disable-next-line prefer-const
    for (let i in configs) {
        if (!config.has(configs[i])) {
            log.error("Config file broken at " + configs[i]);
            return false;
        } else {
            log.debug(configs[i] + " : " + config.get(configs[i]));
        }
    }
    log.info("Config is valid.");
    return true;
}
