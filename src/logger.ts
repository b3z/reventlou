import { Logger } from "@tsed/logger";
import { get } from "config";

export const log = new Logger("log");

log.name = "IMS";

if (!get("log.silent")) {
    log.appenders.set("std-log", {
        type: "stdout",
        layout: { type: "colored" },
        level: ["debug", "info", "error", "fatal", "warn"],
    });
} else {
}

log.appenders.set("everything", {
    type: "file",
    filename: get("log.path"),
});
log.info("Logging path: " + get("log.path"));
