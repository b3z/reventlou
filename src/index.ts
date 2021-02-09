import * as os from "os";

let dot_path = ".reventlou";

// allows to set the dotfile path via paramter -p
const args: any = process.argv; // expect String[]
// eslint-disable-next-line prefer-const
for (let i = 2; i < args.length; ++i) {
    if (args[i] == "-p") {
        dot_path = args[i + 1];
        console.log("Set dotfile directory to /" + args[i + 1]);
    }
}

process.env["NODE_CONFIG_DIR"] = os.homedir() + "/" + dot_path;
import { configExists } from "./configHandler";

// make sure all configuration files and directories exist.
configExists(dot_path);

import * as path from "path";
import { app, BrowserWindow, Menu, ipcMain, shell } from "electron";
import { Database } from "./database";
import { translate } from "./htmlRenderer";
import { isValid } from "./validateConfig";
import { copyToArchive } from "./fileHandler";
import { log } from "./logger";
import { runRedis } from "./redisServer";
import * as config from "config";

// import { Controller } from "./controller"; // this is how we wanna import dude.

let mainWindow: Electron.BrowserWindow;
let db: Database;

async function createWindow(): Promise<void> {
    // run redis server
    runRedis();

    db = new Database(); // init new db cli.
    await db.init(); // connect and make sure index exists.

    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 600,
        title: "Information Management System",
        webPreferences: {
            nodeIntegration: true, // with this set we have nodeIntegration in index.html. No need to use require.js anymore.
        },
        width: 800,
    });

    // and load the index.html of the app.
    void mainWindow.loadFile(path.join(__dirname, "../index.html"));
    // let c = new Controller(); //?!?! is this how it should be done?

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate); // build the actual menu
    Menu.setApplicationMenu(mainMenu); // insert menu

    // make links open in os browser by default. Open Files in desktops default manager.
    const handleRedirect = (e, url: string) => {
        if (url != mainWindow.webContents.getURL()) {
            try {
                e.preventDefault();
                if (url.indexOf("http") != -1) {
                    void shell.openExternal(url);
                } else {
                    if (url.indexOf("explorer:file") != -1) {
                        shell.showItemInFolder(
                            process.env["NODE_CONFIG_DIR"] +
                                `/${config.get("file.archive")}/${url}`.replace(
                                    "explorer:file://",
                                    ""
                                )
                        );
                    } else {
                        shell.openPath(
                            process.env["NODE_CONFIG_DIR"] +
                                `/${config.get("file.archive")}/${url}`.replace(
                                    "file://",
                                    ""
                                )
                        );
                        console.log(
                            process.env["NODE_CONFIG_DIR"] +
                                `/${config.get("file.archive")}/${url}`.replace(
                                    "file://",
                                    ""
                                )
                        );
                    }
                }
            } catch (e) {
                log.error(e);
            }
        }
    };

    mainWindow.webContents.on("will-navigate", handleRedirect);
    mainWindow.webContents.on("new-window", handleRedirect);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// Menu template
const mainMenuTemplate: any[] = [
    // array need to be any so we can add empty object later.
    {
        label: app.getName(),
        submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services", submenu: [] },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "close" },
            { role: "quit" },
        ],
    },
    {
        label: "Edit",
        submenu: [
            {
                label: "Save",
                accelerator: "CmdOrCtrl + S",
                click() {
                    handleSave();
                },
            },
            {
                label: "Clear",
                accelerator: "CmdOrCtrl + D",
                click() {
                    handleClear();
                },
            },
            { type: "separator" },
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            {
                label: "Redo",
                accelerator: "Shift+CmdOrCtrl+Z",
                selector: "redo:",
            },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            {
                label: "Select All",
                accelerator: "CmdOrCtrl+A",
                selector: "selectAll:",
            },
        ],
    },
];

// add developer tools if not in production
if (process.env.NODE_ENV !== "production") {
    mainMenuTemplate.push({
        label: "Dev Tools",
        submenu: [
            {
                label: "Toggle dev tools",
                accelerator:
                    process.platform == "darwin" ? "Command+I" : "Ctrl+I",
                click() {
                    mainWindow.webContents.openDevTools();
                },
            },
            { role: "reload" },
            {
                label: "Validate config",
                click() {
                    isValid();
                },
            },
            { role: "seperator" },
            {
                label: "Test Status Item",
                click() {
                    addStatus(undefined, "But here goes text");
                },
            },
            {
                label: "Icon Status Item",
                click() {
                    addStatus("assets/icons/png/icon.png", undefined);
                },
            },
            {
                label: "Clear all Status",
                click() {
                    clearStatus();
                },
            },
            {
                label: "Suggest",
                click() {
                    suggest();
                },
            },
        ],
    });
}

/*
// If mac add empty object to resolve Electron menu item issue
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
} 
*/

function suggest() {
    mainWindow.webContents.send("editor:get:SuggestValue");
}

/**
 * Add item to statusBar
 *
 * @param iconPath represents the relative path to the icon.
 * @param message which shall eb shown left side of the icon. Put undefined if no message shall be shown.
 */
function addStatus(iconPath: string, message: string) {
    mainWindow.webContents.send("statusItem:add", iconPath, message);
}

/**
 * Clears whole statusBar.
 */
function clearStatus() {
    mainWindow.webContents.send("statusItem:clear");
}

let edit: boolean = false;
let editHash: any = "";

ipcMain.on("notify:edit", (e, hash) => {
    log.warn("EDIT NOTIFY");
    edit = true;
    editHash = hash;
    log.warn(hash);
});

// should execute js code in index.html so it send the value of the editor back to us.
function handleSave() {
    if (edit) {
        log.warn("EDIT");
        // delete old note
        db.deleteNoteByHash(editHash);
        // editor normal mode
        mainWindow.webContents.send("edit:done");
        edit = false;
    }
    mainWindow.webContents.send("editor:get:SaveValue");
}

ipcMain.on("editor:save:value", function (_e, value) {
    clearStatus();
    let status: string;
    if (db.save(value)) {
        status = "Saved.";
    } else {
        status = "Failed to save note.";
    }
    addStatus(undefined, status);
});

ipcMain.on("editor:suggest:value", function (_e, _value) {
    // db.suggest(value);
    log.debug("Needs implementation."); // TODO --> see db, github #1
});

// catch item:search from editor with the editors value.
ipcMain.on("key:search", async (e, item: string) => {
    keySearch(e, item);
});

async function keySearch(e: any, item: string) {
    let res: string[] = [];
    const pass: String[][] = [];
    if (!item) {
        clearStatus(); // maybe implement update status so we can save one call over ipc TODO
        addStatus(undefined, "Type to search...");
    } else {
        res = await db.search(item);
        for (let i = 2; i < res.length; i++) {
            // translate was here
            if (i % 2 === 0 && i !== 0) {
                pass.push([res[i - 1], translate(res[i][1])]); // passing [hash, translate(data)]
            }
            // log.debug(res[i][1]);
        }

        clearStatus();
        addStatus(undefined, `Results: ${res[0]}`);
    }
    e.sender.send("list:update", pass);
}

function handleClear() {
    mainWindow.webContents.send("editor:clear");
}

ipcMain.on("editor:files:save", async (_e: any, files: string[]) => {
    for (const i in files) {
        copyToArchive(files[i]);
    }
});

ipcMain.on("request:raw:note", async (e: any, hash: string) => {
    e.sender.send("serve:raw:note", await db.getNoteByHash(hash));
});

ipcMain.on(
    "delete:note",
    async (e: any, hash: string, editorContent: string) => {
        await db.deleteNoteByHash(hash);
        await keySearch(e, editorContent);
    }
);
