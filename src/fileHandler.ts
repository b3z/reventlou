// import { copyFile, constants, access, existsSync, mkdirSync } from "fs";
// import { promises } from "dns";
// import { rejects } from "assert";
// import { get } from "config";
// import { log } from "./logger";
// const fs = require("fs-extra");

// /**
//  * Check if a file exists.
//  *
//  * @param filePath of the file to check.
//  * @returns true if file exists.
//  */
// export async function exist(filePath: string): Promise<boolean> {
//     return new Promise((resolve) => {
//         access("filePath", constants.F_OK, (err) => {
//             if (err) {
//                 resolve(false);
//             } else {
//                 resolve(true);
//             }
//         });
//     });
// }

// export function copy2archive(filePath: string) {
//     let filePathArr = filePath.split("/");
//     let destination = (get("file.archive") + "/" + filePathArr[filePathArr.length - 1]).replace(/ /g, "_");

//     fs.copy(filePath, destination, (err: Error) => {
//         if (err) return log.error(err);
//     });
// }
