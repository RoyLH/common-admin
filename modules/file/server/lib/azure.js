const azure = require('azure-storage');

module.exports = class AzureFileStorage {
  constructor() {
    this.containerName = process.env.AZURE_CONTAINER || 'commonservice';
    this.storage = azure.createBlobService();
  }

  upload(stream, filePath) {
    return new Promise((resolve, reject) => {
      const _this = this;
      let blobWriteStream = _this.storage.createWriteStreamToBlockBlob(
                _this.containerName,
                filePath,
                (err, result, response) => {
                  const link = _this.storage.getUrl(_this.containerName, filePath);
                  resolve(link);
                });
      stream.pipe(blobWriteStream);
    });
  }

  delete(filePath) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.storage.deleteBlobIfExists(_this.containerName, filePath, function (err, response) {
        err && resolve(false);
        resolve(filePath);
      });
    });
  }
};
