const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer
const Menu = remote.Menu;
const dialog = remote.dialog;
const fs = require('fs');
const eApp = remote.app

const Lang = require('lang.js');
const masg = require('traninfo');

let OpenPath, SavePath, OpenFiledata;
const packageData = require('./package.json');
document.title = packageData['name'];

const local = eApp.getLocale().substring(0,2);

let lang = new Lang({
    messages: masg,
    locale: local,
    fallback: 'en'
});

const TopMenu = [{
        label: lang.get('menubar.file'),
        submenu: [{
                label: lang.get('menubar.file-open'),
                accelerator: 'CmdOrCtrl+O',
                click: () => {
                    OpenPath = dialog.showOpenDialog({
                        title: lang.get('dialog.open-title'),
                        properties: ['openFile'],
                        filters: [{
                                name: lang.get('dialog.filetype-md'),
                                extensions: ['md']
                            },
                            {
                                name: lang.get('dialog.filetype-txt'),
                                extensions: ['txt']
                            },
                            {
                                name: lang.get('dialog.filetype-all'),
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
                label: lang.get('menubar.file-save'),
                accelerator: 'CmdOrCtrl+S',
                click: () => {
                    if (OpenPath) {
                        SavePath = OpenPath[0];
                    } else {
                        SavePath = dialog.showSaveDialog({
                            title: lang.get('dialog.save-title'),
                            filters: [{
                                    name: lang.get('dialog.filetype-md'),
                                    extensions: ['md']
                                },
                                {
                                    name: lang.get('dialog.filetype-all'),
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
                                body: lang.get('masg.filesave')
                            });

                            myNotification.onclick = () => {
                                console.log("Writing done!");
                            }
                        });
                    } else return 0;
                }
            },
            {
                label: lang.get('menubar.file-saveas'),
                accelerator: 'CmdOrCtrl+Shift+S',
                click: () => {
                    SavePath = dialog.showSaveDialog({
                        title: lang.get('dialog.saveas-title'),
                        filters: [{
                                name: lang.get('dialog.filetype-md'),
                                extensions: ['md']
                            },
                            {
                                name: lang.get('dialog.filetype-all'),
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
                                body: lang.get('masg.filesave')
                            });

                            myNotification.onclick = () => {
                                console.log("Writing done!");
                            }
                        });
                    } else return 0;
                }
            },
            {
                label: lang.get('menubar.file-quit'),
                accelerator: 'Command+Q',
                click: () => {
                    remote.app.quit()
                }
            }
        ]
    },
    {
        label: lang.get('about.about'),
        submenu: [{
                label: lang.get('about.fork'),
                click: () => {
                    require('electron').shell.openExternal('https://github.com/labrusca/ElecMD')
                }
            },
            {
                label: lang.get('about.Devtool'),
                accelerator: 'CommandOrControl+F12',
                click: () => {
                    ipc.send('open-DevTools', 'ping')
                }
            },
            {
                label: `${lang.get('about.version')}: ${packageData['version']}`,
                enabled: false
            },
        ]
    }
];

const template = [{
        label: lang.get('mousemenu.cut'),
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
    },
    {
        label: lang.get('mousemenu.copy'),
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
    },
    {
        label: lang.get('mousemenu.paste'),
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
    },
    {
        type: 'separator'
    },
    {
        label: lang.get('mousemenu.selectall'),
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

