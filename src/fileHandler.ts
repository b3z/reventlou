import { get } from "config";
import { access, constants } from "fs";
import { log } from "./logger";

const fs = require("fs-extra");

/**
 * Check if a file exists.
 *
 * @param filePath of the file to check.
 * @returns true if file exists.
 */
export async function exist(filePath: string): Promise<boolean> {
    return new Promise((resolve) => {
        access("filePath", constants.F_OK, (err) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

export function copyToArchive(filePath: string) {
    log.warn(process.env["NODE_CONFIG_DIR"]);
    const filePathArr = filePath.split("/");
    const destination = (
        process.env["NODE_CONFIG_DIR"] + // is equal to os.homedir + specified dotpath in index.ts
        get("file.archive") +
        "/" +
        filePathArr[filePathArr.length - 1]
    ).replace(/ /g, "_");

    fs.copy(filePath, destination, (err: Error) => {
        if (err) {
            return log.error(err);
        }
    });
}
