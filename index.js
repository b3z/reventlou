const electron = require('electron');
const {ipcRenderer} = electron;



const statusBar = document.getElementById("statusBar")
const editor = document.getElementById('editor');
const list = document.getElementById('resultList');

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

// listener for editor search on type. On keyrelease send ipc search
editor.addEventListener("keyup", (e) => {
    console.log(e)
    if (e.key !== "Meta") {
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
        li.addEventListener('dblclick', () => {handleEdit(li.id)});
        list.appendChild(li);
    }
});

ipcRenderer.on('editor:clear', (e) => {
    editor.value = '';
});

function toggle(e, c) {
    const classes = e.className.split(" ");
    const i = classes.indexOf(c);

    if (i >= 0)
        {classes.splice(i, 1);}
    else
        {classes.push(c);}
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
    // get new input

    // save new note
    // delete old note
    
}

