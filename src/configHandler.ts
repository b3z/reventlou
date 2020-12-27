import * as os from "os";
import { existsSync, mkdirSync, copyFileSync } from "fs";

const DOT_R_PATH = os.homedir() + "/.reventlou";
const DEFAULT_CONFIG = DOT_R_PATH + "/default.json5";
const ARCHIVE = DOT_R_PATH + "/archive";
const DB = DOT_R_PATH + "/db";

export function configExists() {
    console.log("running dofile checks ----------------------------");
    if (!existsSync(DOT_R_PATH)) {
        console.log(".reventlou doesn't exists. Creating it now.");
        mkdirSync(DOT_R_PATH);
        // make it
    }
    if (!existsSync(DEFAULT_CONFIG)) {
        console.log("deafult config doesn't exists. Creating it now.");
        copyFileSync("config/default.json5", DEFAULT_CONFIG);

        // make it
    }
    if (!existsSync(ARCHIVE)) {
        console.log("archive doesn't exists. Creating it now.");
        mkdirSync(ARCHIVE);

        // make it
    }
    if (!existsSync(DB)) {
        console.log("DB doesn't exists. Creating it now.");
        mkdirSync(DB);

        // make it
    }
}
