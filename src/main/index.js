'use strict';

import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import * as Realm from 'realm'

const DogSchema = {
    name: 'Dog',
    properties: {
        name: 'string',
        age: 'int',
    }
};

Realm.open({
    schema: [DogSchema],
    path: `${app.getPath('userData')}/realm/dog.realm`,
})
.then((realm) => {
    let dogs = realm.objects('Dog'); // retrieves all Dogs from the Realm
    if(dogs.length === 0) {
        try {
            realm.write(() => {
                realm.create('Dog', {
                    name: 'Bro',
                    age: 10
                });
            });
        } catch (e) {
            console.log("Error on creation");
        }
        console.log('Saved Bro');
    }
});


const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow();

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus()
    })
  });

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
});
