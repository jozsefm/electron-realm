# Electron Realm 
A proof of concept repo to investigate if realm can be integrated with electron on Windows desirably using `electron-builder` as the packager.

## Key take-away
If we install the package inside Program Files and ask for administrator rights for the executable, Realm.js will work fine.
This setup configures the electron-builder nsis installer to do just that for us.
http://layer0.authentise.com/electron-and-uac-on-windows.html  
https://github.com/electron-userland/electron-builder/issues/1932
