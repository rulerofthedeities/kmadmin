const Uploader = require('s3-streaming-upload').Uploader,
      fs = require('fs'),
      response = require('../../response'),
      mongoose = require('mongoose'),
      Files = require('../../models/jazyk/file');

checkIfDuplicate = function(localFile, cb) {
  let q = {localFile: localFile.name};
  console.log('checking', localFile, q);
  Files.findOne(q, function(err, file) {
    if (file) {
      cb(err, true);
    } else {
      cb(err, false);
    }
  });
}

module.exports = {
  uploadFile: function (req, res) {
    console.log('upload body', req.body);
    const tpe = req.body.tpe,
          newFileName = new mongoose.mongo.ObjectId(),
          legacyFileName = req.body.file.name,
          format = req.body.file.type;

    let localPath, s3Folder, contentTpe;

    switch (tpe) {
      case 'images':
        localPath = '/projects/kmodo/km-admin/files/jazyk/images/publish/';
        s3Folder = 'images/';
        contentTpe = 'image/'
        break;
      case 'audio':
        const lan = legacyFileName.split('-')[0];
        localPath = '/projects/kmodo/km-admin/files/jazyk/audio/publish/';
        s3Folder = 'audio/' + lan + '/';
        contentTpe = 'audio/'
        break;
    }

    console.log('Checking if file already exists in local db');
    checkIfDuplicate(req.body.file, function(err, isDuplicate){
      if (isDuplicate) {
        response.handleSuccess(res, {file:null, legacyFile:req.body.file, isDuplicate}, 200, 'File already exists');
      } else {
        console.log('creating stream for ', localPath + legacyFileName);

        const stream = fs.createReadStream(localPath + legacyFileName);
        
        let upload = new Uploader({
          accessKey:  process.env.AWS_S3_ID,
          secretKey:  process.env.AWS_S3_KEY,
          bucket:     'jazyk',
          region:     'eu-central-1',
          objectName: s3Folder + newFileName,
          stream:     stream,
          debug:      true,
          objectParams: {
            ContentType: format,
            ACL: 'public-read'
          }
        });

        upload.send(function (err, file) {
          response.handleError(err, res, 500, 'Error uploading file to S3', function(){
            file._id = newFileName;
            response.handleSuccess(res, {file, legacyFile:req.body.file, isDuplicate}, 200, 'Uploaded file to S3');
          });
        });
      }
    })
  },
  addFile: function (req, res) {
    console.log('body', req.body);
    const data = req.body;

    Files.create(data, function(err, result) {
      response.handleError(err, res, 500, 'Error adding file to local db', function() {
        response.handleSuccess(res, result, 200, 'Added file to local db');
      });
    });
  },
  getFiles: function (req, res) {
    const query = req.query,
          returnTotal = query.returnTotal === 'true' ? true : false,
          word = query.isFromStart === 'true' ? "^" + query.word : query.word,
          search = query.isExact === 'true' ? query.word : {$regex: word, $options:'i'},
          lan = query.lan;

    const q = {
            app: query.app,
            tpe: query.tpe,
            name: search
          };
    if (lan) {
      q.lan = lan ==='en' ? {$in: ['gb', 'us']} : lan;
    }

    Files.find(q, {}, {limit: 20, sort:{localFile: 1}}, function(err, files) {
      response.handleError(err, res, 500, 'Error fetching file list from local db', function() {
        // Count workaround until v3.4 (aggregate)
        if (returnTotal) {
          Files.count(q, function(err, total) {
            response.handleError(err, res, 500, 'Error fetching file list total from local db', function(){
              response.handleSuccess(res, {files, total}, 200, 'Fetched file list from local db');
            });
          });
        } else {
          response.handleSuccess(res, {files, total:0}, 200, 'Fetched file list from local db');
        }
      });
    });
  }
}
