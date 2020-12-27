import * as os from "os";
import { existsSync, mkdirSync, copyFileSync } from "fs";

const DOT_R_PATH = os.homedir() + "/.reventlou";
const DEFAULT_CONFIG = DOT_R_PATH + "/default.json5";
const REDIS_DEFAULT_CONFIG = DOT_R_PATH + "/db/redis.conf";
const ARCHIVE = DOT_R_PATH + "/archive";
const DB = DOT_R_PATH + "/db";
const LOGS = DOT_R_PATH + "/logs/";

// Make sure those exist.

export function configExists() {
    console.log("running dofile checks ----------------------------");
    if (!existsSync(DOT_R_PATH)) {
        console.log(".reventlou doesn't exists. Creating it now.");
        mkdirSync(DOT_R_PATH);
    }
    if (!existsSync(DEFAULT_CONFIG)) {
        console.log("default config doesn't exists. Creating it now.");
        copyFileSync(__dirname + "/../config/default.json5", DEFAULT_CONFIG);
    }
    if (!existsSync(ARCHIVE)) {
        console.log("archive doesn't exists. Creating it now.");
        mkdirSync(ARCHIVE);
    }
    if (!existsSync(DB)) {
        console.log("DB doesn't exists. Creating it now.");
        mkdirSync(DB);
    }
    if (!existsSync(LOGS)) {
        console.log("LOGS doesn't exists. Creating it now.");
        mkdirSync(LOGS);
    }
    if (!existsSync(REDIS_DEFAULT_CONFIG)) {
        console.log("default redis config doesn't exists. Creating it now.");
        copyFileSync(__dirname + "/../config/redis.conf", REDIS_DEFAULT_CONFIG);
    }
}
