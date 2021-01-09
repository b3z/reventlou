const electron = require('electron');
const { resolveModuleName } = require('typescript');
const {
    ipcRenderer
} = electron;
window.$ = window.jQuery = require('jquery');



const statusBar = document.getElementById("statusBar")
const editor = document.getElementById('editor');
const list = document.getElementById('resultList');
const rmenu = document.getElementById("rmenu");

ipcRenderer.on('editor:get:SaveValue', (e) => {
    e.sender.send('editor:save:value', document.querySelector("#editor").value);
})

ipcRenderer.on('editor:get:SuggestValue', (e) => {
    e.sender.send('editor:suggest:value', document.querySelector("#editor").value);
})

// add new item to status bar
ipcRenderer.on('statusItem:add', (e, iconPath, message) => { //TODO add hrefs and stuff...
    // wrapper element - all status-ies are wrapped in a tag. Might change that later.
    const a = document.createElement('a');
    if (iconPath) {
        // create status icon as a img child of a tag.
        const img = document.createElement('img');
        img.setAttribute('src', iconPath); // set image source path.
        // append img to a
        a.appendChild(img);
    }
    if (message) {
        a.appendChild(document.createTextNode(message)); // put message left to icon.
    }
    // don't add empty items. 
    if (message || iconPath) {
        statusBar.appendChild(a);
    } else {
        console.log('No Item was added to statusBar.');
    }
});

// clears status bar - remove all items
ipcRenderer.on('statusItem:clear', (e, statusItem) => {
    statusBar.innerHTML = '';
});

let searchLock = false;

// listener for editor search on type. On keyrelease send ipc search
editor.addEventListener("keyup", (e) => {
    if (e.key !== "Meta" && !searchLock) {
        console.log(e)
        ipcRenderer.send('key:search', editor.value);
    }
});

let listBGActive = false
// list result management
// called by index.ts in an webcontents js execution
ipcRenderer.on('list:update', (e, res) => {
    list.innerHTML = ''; // clear list

    if (res.length < 1 && listBGActive) {
        toggle(document.getElementById('view'), "blur")

        listBGActive = false
    } else if (res.length > 0 && !listBGActive) {
        toggle(document.getElementById('view'), "blur")
        listBGActive = true
    }

    for (const i in res) {
        const li = document.createElement('li');
        li.innerHTML = res[i][1];
        li.id = res[i][0];

        li.addEventListener('dblclick', () => {
            handleEdit(li.id)
        });

        li.addEventListener('contextmenu', function (e) {

            const deleteNote = document.createElement('p');
            deleteNote.id = li.id;
            deleteNote.innerHTML = "Delete"
            deleteNote.addEventListener("click", () => {
                //delete note
                console.log("deleteNote "+ li.id);

                ipcRenderer.send("delete:note", li.id, editor.value);
            });

            rmenu.appendChild(deleteNote);

            rmenu.className = "show";
            rmenu.style.top = mouseY(event) + 'px';
            rmenu.style.left = mouseX(event) + 'px';

            window.event.returnValue = false;
        });

        list.appendChild(li);
    }
});

// listen for clicks to hide context menu.
$(document).bind("click", function (event) {
    rmenu.className = "hide";
    rmenu.innerHTML = ""; // clear menu

});

function mouseX(evt) {
    if (evt.pageX) {
        return evt.pageX;
    } else if (evt.clientX) {
        return evt.clientX + (document.documentElement.scrollLeft ?
            document.documentElement.scrollLeft :
            document.body.scrollLeft);
    } else {
        return null;
    }
}

function mouseY(evt) {
    if (evt.pageY) {
        return evt.pageY;
    } else if (evt.clientY) {
        return evt.clientY + (document.documentElement.scrollTop ?
            document.documentElement.scrollTop :
            document.body.scrollTop);
    } else {
        return null;
    }
}

ipcRenderer.on('editor:clear', (e) => {
    editor.value = '';
});

function toggle(e, c) {
    const classes = e.className.split(" ");
    const i = classes.indexOf(c);

    if (i >= 0) {
        classes.splice(i, 1);
    } else {
        classes.push(c);
    }
    e.className = classes.join(" ");
}

// Drag n Drop on editor

// Setup the dnd listeners.
editor.addEventListener('dragover', handleDragOver, false);
editor.addEventListener('drop', handleFileDrop, false);

// document.addEventListener("dragenter", (event) => {
//     console.log("File is in the Drop Space");
// });

// document.addEventListener("dragleave", (event) => {
//     console.log("File has left the Drop Space");
// });

function handleFileDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    const files = evt.dataTransfer.files; // FileList object.
    const fileArr = []
    for (let i = 0; i < files.length; i++) {
        fileArr.push(files.item(i).path)
        editor.value = editor.value + "\nfile://" + files.item(i).name.replace(/ /g, "_")
    }
    ipcRenderer.send('editor:files:save', fileArr);

}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// editing

function handleEdit(id) {
    console.log(id);

    // get old data
    ipcRenderer.send('request:raw:note', id);
    ipcRenderer.send('notify:edit', id);

    ipcRenderer.on('serve:raw:note', (e, note) => {
        // load old data
        editor.value = note;
        // get new input/modifiy
        editorEditMode()
    });
}

ipcRenderer.on("edit:done", () => {
    editorNormalMode()
})

function editorEditMode() {
    list.innerHTML = ''; // clear list
    searchLock = true;
    editor.style.height = "90%";
}

function editorNormalMode() {
    searchLock = false;
    editor.style.height = "100px";

    // listener for editor search on type. On keyrelease send ipc search

}