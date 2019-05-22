'use strict';

const formidable = require('formidable'),
  mongoose = require('mongoose'),
  File = mongoose.model('file'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  _ = require('lodash'),
  async = require('async'),
  fs = require('fs'),
  crypto = require('crypto'),
  APIError = require(path.resolve('./config/lib/APIError')),
  FileStorage = require(config.fileStoragePath),
  serverStorageName = config.serverStorageName;

const deleteFile = (filePath) => new FileStorage().delete(filePath);

const deleteFolder = (folder) => {
  const folderRegExp = new RegExp(folder.replace('\\', '\\\\'));
  return File.find({
    folder: folderRegExp
  })
        .then(files => {
          return new Promise((resolve, reject) => {
            async.each(files, (file, callback) => {
              if (file.isDir === 0) {
                const filePath = path.join(serverStorageName, file.uniqueName);
                deleteFile(filePath).then(() => {
                  console.log('delete file');
                  callback();
                });
              } else {
                console.log('delete dir');
                callback();
              }
            }, err => {
              if (err) {
                return reject(err);
              } else {
                return resolve();
              }
            });
          });
        });
};

exports.upload = (req, res, next) => {
  let virtualRootFolder = 'index',
    folder = req.query.folder || virtualRootFolder,
    fileInfo = {};

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.encoding = 'utf-8';
  form.multiples = true;
  form.maxFieldsSize = config.fileOptions.maxFieldsSize;

  let uploadFile = () => {
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, {file}) => {
        if (err) return reject(err);
        fileInfo = file;
        fileInfo.uniqueName = crypto.randomBytes(10).toString('hex') + ((new Date()).getTime()) + path.extname(file.name);
        fileInfo.readStream = fs.createReadStream(fileInfo.path);
        fileInfo.filePath = ('/' + path.join(serverStorageName, fileInfo.uniqueName)).replace(new RegExp(/\\/, 'g'), '/');
        return resolve();
      });
    })
            .then(() => {
              return new FileStorage().upload(fileInfo.readStream, fileInfo.filePath, req.protocol, req.headers.host);
            });
  };

  uploadFile()
        .then(link => {
          const file = new File({
            name: fileInfo.name,
            customName: fileInfo.name,
            size: fileInfo.size,
            user: req.user ? req.user._id : '',
            folder: folder,
            isDir: 0,
            link: link,
            uniqueName: fileInfo.uniqueName
          });
          return file.save();
        })
        .then(file => res.send({
          code: '402001',
          data: file
        }))
        .catch(err => next(err));
};

exports.createFolder = (req, res, next) => {
  const {folder, name} = req.body;
  if (!name || !folder) return next(new APIError('102001', 400));
  let fileInfo = {
    name: name,
    size: 0,
    isDir: 1,
    folder: folder,
    user: req.user ? req.user._id : ''.anchor(),
    link: '',
    customName: path.join(folder, name),
    uniqueName: path.join(folder, name)
  };
  const file = new File(fileInfo);
  file.save()
        .then(dir => res.send({
          code: '402001',
          data: dir,
          messageInfo: ['Folder', dir.name]
        }))
        .catch(next);
};

exports.list = (req, res, next) => {
  let query = {};
  if (req.query.folder) query.folder = req.query.folder;
  if (req.query.type === 'img') query.name = /\.(|jpg|jpeg|png|gif)$/;
  if (req.query.type === 'dir') query.isDir = 1;
  File.find(query, (err, files) => {
    if (err) {
      return next(err);
    } else {
      return res.send({
        code: '400000',
        data: files
      });
    }
  });
};

exports.read = (req, res, next) => {
  const file = req.file;
  return res.send({
    code: '400000',
    data: file
  });
};

exports.delete = (req, res, next) => {
  const file = req.file;

  let deleteData = () => {
    if (file.isDir === 0) {
      const filePath = path.join(serverStorageName, file.uniqueName);
      return deleteFile(filePath)
                .then(() => file.remove());
    } else {
      const folder = file.customName;
      return deleteFolder(folder)
                .then(() => File.remove({
                  $or: [
                        {folder: new RegExp(folder.replace('\\', '\\\\'))},
                        {customName: folder}
                  ]
                }));
    }
  };
  deleteData()
        .then(file => res.send({
          code: '402003',
          messageInfo: ['File', file.name]
        }))
        .catch(next);
};

exports.removeFilesByIds = (req, res, next) => {
  const fileIds = req.query.fileIds,
    options = {_id: {$in: fileIds}};

  let deleteFileQuery = [options];
  File.find(options)
        .then(files => {
          async.each(files, (file, callback) => {
            if (file.isDir) {
              deleteFolder(file.customName).then(callback);
              deleteFileQuery.push({folder: new RegExp(file.customName.replace('\\', '\\\\'))});

            } else {
              const filePath = path.join(serverStorageName, file.uniqueName);
              deleteFile(filePath).then(callback);
            }
          }, () => Promise.resolve());
        })
        .then(() => File.remove({$or: deleteFileQuery}))
        .then(() => res.send({
          code: '402003'
        }))
        .catch(next);
};

exports.update = (req, res, next) => {
  let file = req.file;
  file = _.extend(file, req.body);
  file.save((err) => {
    if (err) {
      return next(err);
    } else {
      return res.send({
        code: '402002',
        messageInfo: ['File', file.customName]
      });
    }
  });
};

exports.fileById = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new APIError('102001', 400));
  }
  File.get(id).then((file) => {
    req.file = file;
    next();
  }, next);
};
