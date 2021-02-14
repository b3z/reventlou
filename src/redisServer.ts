import { spawn } from "child_process";
import { log } from "./logger";
import { unlink, readFile, writeFile } from "fs";
import { homedir } from "os";

const DOT_R_PATH = process.env["NODE_CONFIG_DIR"]; // see index.
const DIR = __dirname; // actual directory the app is running in.
const RS_PATH = DIR + "/../Resources/app/server/modules"; // Redisearch path.
const REDIS_SERVER_PATH = DIR + "/../Resources/app/server/redis-server";
const REDIS_TMP_CONF = DOT_R_PATH + "/db/redis.tmp.conf";
const REDIS_CONF = DOT_R_PATH + "/db/redis.conf";
const HOME = homedir(); // $HOME

export function runRedis(): void {
    setupServer();
    const redis = spawn(REDIS_SERVER_PATH, [REDIS_TMP_CONF]);

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

function setupServer(): void {
    // delete old redis tmp config.
    unlink(REDIS_TMP_CONF, (err) => {
        if (err) {
            log.error(err);
        }
    });

    // replace config variables
    readFile(REDIS_CONF, "utf8", (err, data) => {
        if (err) {
            return log.error(err);
        }

        let result = data.replace("MY_HOME", HOME);
        result = result.replace("DOT_REVENTLOU", DOT_R_PATH);
        result = result.replace("RS_PATH", RS_PATH);

        writeFile(REDIS_TMP_CONF, result, "utf8", function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}
