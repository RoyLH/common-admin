const url = require('url'),
    upyun = require('upyun');

module.exports = class UpyunFileStorage {
    constructor() {
        this.upyunProtocol = process.env.UPYUN_PROTOCOL || 'http';
        this.upyunHostname = process.env.UPYUN_HOSTNAME || 'common-service.test.upcdn.net';
        const upyunAccount = {
            serverName: 'common-service',
            username: 'serveradmin',
            password: '123gogogo'
        };
        const upYunService = new upyun.Service(upyunAccount.serverName, upyunAccount.username, upyunAccount.password);
        this.upYunClient = new upyun.Client(upYunService);
    }
    upload(stream, filePath) {
        const upYunParams = {
            'Date': new Date
        };
        const _this = this;
        return new Promise((resolve, reject) => {
            this.upYunClient.putFile(filePath, stream, upYunParams)
                .then(upYunFileInfo => {
                    const link = url.format({
                        protocol: _this.upyunProtocol,
                        host: _this.upyunHostname,
                        pathname: filePath
                    });
                    resolve(link);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    delete(filePath) {
        return new Promise((resolve, reject) => {
            filePath = filePath.replace(new RegExp(/\\/, 'g'), '/');
            this.upYunClient.deleteFile(filePath)
                .then(deleteSuccess => {
                    if (deleteSuccess) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
};
