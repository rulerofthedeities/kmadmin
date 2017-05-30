const Uploader = require('s3-streaming-upload').Uploader,
      fs = require('fs'),
      response = require('../../response'),
      mongoose = require('mongoose'),
      folder = 'images/',
      Files = require('../../models/jazyk/file');

module.exports = {
  uploadFile: function (req, res) {
    console.log('body', req.body);

    console.log('file id', new mongoose.mongo.ObjectId());

    const newFileName = new mongoose.mongo.ObjectId();
    const legacyFileName = req.body.file;
    const name = legacyFileName.split('.')[0];
    const format = legacyFileName.split('.')[1] || 'unknown';
    console.log('meta name', name);
    console.log('meta format', format);

    const stream = fs.createReadStream('/projects/kmodo/km-admin/files/jazyk/images/publish/' + req.body.file);
    
    let upload = new Uploader({
      accessKey:  process.env.AWS_S3_ID,
      secretKey:  process.env.AWS_S3_KEY,
      bucket:     'jazyk',
      region:     'eu-central-1',
      objectName: folder + newFileName,
      stream:     stream,
      debug:      true,
      objectParams: {
        ContentType: 'image/' + format,
        ACL: 'public-read'
      }
    });

    upload.send(function (err, file) {
      response.handleError(err, res, 500, 'Error uploading file to S3', function(){
        response.handleSuccess(res, file, 200, 'Uploaded file to S3');
      });
    });
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
          search = query.isExact === 'true' ? query.word : {$regex: word, $options:'i'};

    const q = {
            app: query.app,
            tpe: query.tpe,
            name: search
          };

    Files.find(q, {}, {limit: 10, sort:{localFile: 1}}, function(err, files) {
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
