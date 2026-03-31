const { app, BrowserWindow, screen, ipcMain, globalShortcut } = require('electron');

app.disableHardwareAcceleration();

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    // Se não tem a chave, morre imediatamente (força bruta)
    app.exit(0); 
} else {
    // A primeira instância ouve a tentativa de abrir uma nova
    app.on('second-instance', () => {
        // O Renascimento: Repassa todos os argumentos originais para garantir que ele ache a pasta
        app.relaunch({ args: process.argv.slice(1) });
        
        // A Morte: app.exit(0) é o equivalente nativo do "kill -9". Derruba tudo na hora.
        app.exit(0);
    });

    app.on('second-instance', () => {
        app.relaunch({ args: process.argv.slice(1) });
        app.exit(0);
    });
	
	
	app.whenReady().then(() => {
        ipcMain.handle('get-user-path', () => app.getPath('userData'));
        
        // A NOVA ARQUITETURA DE SAÍDA: Ouve o hardware, não a tela.
        // Pressionar Ctrl + Shift + X vai aniquilar o processo graciosamente, de qualquer lugar do SO.
        globalShortcut.register('CommandOrControl+Shift+X', () => {
            console.log('Kill switch acionado via teclado. Encerrando...');
            app.quit();
        });
        
        createWidgets();
    });

    // Boa prática de engenharia: Limpar os atalhos da memória quando o app morrer
    app.on('will-quit', () => {
        globalShortcut.unregisterAll();
    });
}

function createWidgets() {
    const allDisplays = screen.getAllDisplays();

    allDisplays.forEach((display) => {
        const { width, height, x, y } = display.bounds;
        
        if (width > 1900) {
            const win = new BrowserWindow({
                width: width,
                height: height,
                x: x, 
                y: y,
                transparent: true,
                frame: false,
                hasShadow: false,
                skipTaskbar: true,
                type: 'desktop',
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                }
            });

            win.setIgnoreMouseEvents(true, { forward: true });
            win.loadFile('index.html');
        }
    });
	
	
}