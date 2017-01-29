const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer
const Menu = remote.Menu;
const dialog = remote.dialog;
const fs = require("fs");
let OpenPath, SavePath, OpenFiledata;
const packageData = require('./package.json');
document.title = packageData['name'];
const TopMenu = [{
        label: 'File',
        submenu: [{
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click: () => {
                    OpenPath = dialog.showOpenDialog({
                        title: "Open File",
                        properties: ['openFile'],
                        filters: [{
                                name: 'Markdown Files',
                                extensions: ['md']
                            },
                            {
                                name: 'Text Files',
                                extensions: ['txt']
                            },
                            {
                                name: 'All Files',
                                extensions: ['*']
                            }
                        ]
                    });
                    // 异步读取文件    
                    if (OpenPath) {
                        fs.readFile(OpenPath[0], {
                            encoding: 'utf8',
                            flag: 'r'
                        }, (err, Opendata) => {
                            if (err) {
                                return console.error(err);
                            }
                            OpenFiledata = Opendata;
                            simplemde.value(OpenFiledata);
                            document.title = `${OpenPath} - ${packageData['name']}`;
                        });
                    }
                }
            },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click: () => {
                    if (OpenPath) {
                        SavePath = OpenPath[0];
                    } else {
                        SavePath = dialog.showSaveDialog({
                            title: "Save File",
                            filters: [{
                                    name: 'Markdown Files',
                                    extensions: ['md']
                                },
                                {
                                    name: 'All Files',
                                    extensions: ['*']
                                }
                            ]
                        });
                    }
                    if (SavePath) {
                        fs.writeFile(SavePath, simplemde.value(), (err) => {
                            if (err) {
                                return console.error(err);
                            }
                            //Display the notification when file has been saved,work on Linux,Mac os,Windows 10
                            const myNotification = new Notification('ELecMD Notification', {
                                body: 'File saved!'
                            });

                            myNotification.onclick = () => {
                                console.log("Writing done!");
                            }
                        });
                    } else return 0;
                }
            },
            {
                label: 'Save as...',
                accelerator: 'CmdOrCtrl+Shift+S',
                click: () => {
                    SavePath = dialog.showSaveDialog({
                        title: "Save File as",
                        filters: [{
                                name: 'Markdown Files',
                                extensions: ['md']
                            },
                            {
                                name: 'All Files',
                                extensions: ['*']
                            }
                        ]
                    });
                    if (SavePath) {
                        fs.writeFile(SavePath, simplemde.value(), (err) => {
                            if (err) {
                                return console.error(err);
                            }
                            //Display the notification when file has been saved,work on Linux,Mac os,Windows 10
                            const myNotification = new Notification('ELecMD Notification', {
                                body: 'File saved!'
                            });

                            myNotification.onclick = () => {
                                console.log("Writing done!");
                            }
                        });
                    } else return 0;
                }
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: () => {
                    remote.app.quit()
                }
            }
        ]
    },
    {
        label: 'About',
        submenu: [{
                label: 'Fork ElecMD on Github',
                click: () => {
                    require('electron').shell.openExternal('https://github.com/labrusca/ElecMD')
                }
            },
            {
                label: 'DeveTools',
                accelerator: 'CommandOrControl+F12',
                click: () => {
                    ipc.send('open-DevTools', 'ping')
                }
            },
            {
                label: `Version: ${packageData['version']}`,
                enabled: false
            },
        ]
    }
];

let template = [{
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
    },
    {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
    },
    {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
    },
    {
        type: 'separator'
    },
    {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
    }
];
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(Menu.buildFromTemplate(TopMenu));

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
}, false);

window.addEventListener('drop', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    fs.readFile(f.path, {
                encoding: 'utf8',
                flag: 'r'
            }, (err, Opendata) => {
                    if (err) {
                        return console.error(err);
                    }
                    OpenFiledata = Opendata;
                    simplemde.value(OpenFiledata);
                    document.title = `${f.path} - ${packageData['name']}`;
                }
    );
}, false);
