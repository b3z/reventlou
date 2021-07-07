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
}

log.appenders.set("everything", {
    type: "file",
    filename: process.env["NODE_CONFIG_DIR"] + "/logs/" + get("log.file"), // see NODE_CONFIG_DIR in index.ts
});
log.info(
    `Logging path: ${
        process.env["NODE_CONFIG_DIR"] + "/logs/" + get("log.file")
    }`
);
