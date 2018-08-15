const fs = require('fs'),
    path = require('path'),
    url = require('url'),
    mkdirp = require('mkdirp');

module.exports = class LocalFileStorage {
    upload(stream, filePath, protocol, host) {
        const writePath = path.join(process.cwd(), filePath);
        let dir = path.dirname(writePath);
        !fs.existsSync(dir) && mkdirp.sync(dir);
        // pipe stream
        let fileWriteStream = fs.createWriteStream(writePath);
        stream.pipe(fileWriteStream);
        return new Promise((resolve, reject) => {
            fileWriteStream.on('close', function () {
                const link = url.format({
                    protocol: protocol || 'http',
                    host: host || '7000',
                    pathname: filePath
                });
                console.log('upload file to local in:' + filePath);
                resolve(link);
            });
        });
    }

    delete(filePath) {
        return new Promise((resolve, reject) => {
            const deletePath = path.join(process.cwd(), filePath);
            const exists = fs.existsSync(filePath);
            if (exists) {
                fs.unlinkSync(filePath);
                resolve(deletePath);
            } else {
                resolve(false);
            }
        });
    }
};
