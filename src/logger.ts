import { Logger } from "@tsed/logger";
import { get } from "config";
import * as os from "os";

export const log = new Logger("log");

log.name = "IMS";

if (!get("log.silent")) {
    log.appenders.set("std-log", {
        type: "stdout",
        layout: { type: "colored" },
        level: ["debug", "info", "error", "fatal", "warn"],
    });
}

log.appenders.set("everything", {
    type: "file",
    filename: os.homedir() + "/.reventlou/logs/" + get("log.file"), //! WIN - dotfile
});
log.info(`Logging path: ${os.homedir()}/.reventlou/logs/${get("log.file")}`); //! - WIN dotfile
