Error.stackTraceLimit = Infinity;

let crypto = require('node:crypto');
let fs = require('node:fs');
let http = require('node:http');
let path = require('node:path');
let perf_hooks = require('node:perf_hooks');

let {build} = require('./build.js');

let host = 'localhost';
let port = 8000;
let log = (...args) => console.log(new Date(), ...args);
let logError = (...args) => console.error(new Date(), ...args);

let textEncoder = new TextEncoder();
let RELOAD_MESSAGE = 'reload';
let RELOAD_DATA_FRAME = new Uint8Array(2 + RELOAD_MESSAGE.length);
RELOAD_DATA_FRAME[0] = 0x81;
RELOAD_DATA_FRAME[1] = RELOAD_MESSAGE.length;
textEncoder.encodeInto(RELOAD_MESSAGE, RELOAD_DATA_FRAME.subarray(2));

let currentWebSocket;

let server = http.createServer(async (request, response) => {
    let url = new URL(request.url, 'http://' + request.headers.host);
    let filename = url.pathname;
    if (filename == '/') {
        filename = '/index.html';
    }
    filename = path.join('public', filename);

    let contentType = 'text/plain';
    if (filename.endsWith('.html')) {
        contentType = 'text/html';
    } else if (filename.endsWith('.js')) {
        contentType = 'text/javascript';
    } else if (filename.endsWith('.css')) {
        contentType = 'text/css';
    } else if (filename.endsWith('.svg')) {
        contentType = 'image/svg+xml';
    } else if (filename.endsWith('.webp')) {
        contentType = 'image/webp';
    } else if (filename.endsWith('.woff2')) {
        contentType = 'font/woff2';
    }

    let statusCode = 200;
    let data = '';
    let preflight = false;
    let responseHeaders = {
        'Content-Type': contentType,
    };
    if (request.headers['sec-fetch-dest'] == 'empty') {
        preflight = true;
    } else {
        try {
            data = fs.readFileSync(filename);
        } catch (error) {
            statusCode = 404;
        }
    }

    let indent = ' '.padStart(9 - data.length.toString().length);
    log(indent, data.length, 'bytes, HTTP', request.method, statusCode, request.url, preflight ? '(pre-flight)' : '');

    response.writeHead(statusCode, responseHeaders);
    response.end(data);
});

async function rebuild() {
    let buildStartTime = perf_hooks.performance.now();
    log('Building...');

    let error;
    try {
        await build();
    } catch (e) {
        error = e;
    } finally {
        let buildEndTime = perf_hooks.performance.now();
        let buildElapsed = (buildEndTime - buildStartTime).toFixed(4);

        if (error) {
            logError(error);
            logError('[FAIL] Build failed. ' + buildElapsed + 'ms');
        } else {
            log('[PASS] Build succeeded. ' + buildElapsed + 'ms');
            if (currentWebSocket) {
                log('Triggering reload...');
                currentWebSocket.write(RELOAD_DATA_FRAME);
            }
        }
    }
}

server.listen(port, host, async () => {
    log(`Listening on http://${host}:${port}`);
    
    await rebuild(0);

    let watchPath = path.resolve('code/');
    log('Watching', watchPath, 'recursively for changes...');
    let rebuildTimer;
    fs.watch(watchPath, {recursive: true}, (eventType, filename) => {
        log('[watch]', {eventType, filename});
        clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(rebuild, 50); // NOTE(chuck): fs.watch() spams duplicates.
    });
});

server.on('upgrade', (request, socket, head) => {
    let clientKey = request.headers['sec-websocket-key'];
    let sha1 = crypto.createHash('sha1');
    sha1.update(clientKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
    let acceptKey = sha1.digest('base64');
    let responseHeaders =
        'HTTP/1.1 101 Switching Protocols\r\n' +
        'Upgrade: websocket\r\n' +
        'Connection: Upgrade\r\n' +
        'Sec-WebSocket-Accept: ' + acceptKey + '\r\n' +
        '\r\n';
    socket.write(responseHeaders);
    currentWebSocket = socket;
});
