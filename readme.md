It's a Markdown Editor,base on [electron](https://github.com/electron/electron).
****************************
# How to use

#### First,you need to install npm & electron.  for fedora 25,do:

```
sudo dnf install nodejs
npm install electron
```

#### Then clone this repository:

```
git clone https://github.com/labrusca/ElecMD
```

```
cd ElecMD
```

#### Run:

```
electron ./src    #unstable
```
or
```
electron ./package/app.asar
```
#### Enjoy it!

Use the rebuild-asar.sh to package when you modify

Tested on fedora 25

Under **MIT** license
