import { spawn } from "child_process";
import { log } from "./logger";

export function runRedis(): void {
    const redis = spawn("sh", [__dirname + "/../server/server.sh"]);

    redis.stdout.on("data", (data) => {
        log.info(`[REDIS] ${data}`);
    });

    redis.stderr.on("data", (data) => {
        log.warn(`[REDIS] ${data}`);
    });

    redis.on("error", (error) => {
        log.error(`[REDIS] ${error.message}`);
    });

    redis.on("close", (code) => {
        console.info(`[REDIS] child process exited with code ${code}`);
    });
}
