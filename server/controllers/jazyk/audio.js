const fs = require('fs'),
      response = require('../../response'),
      INPUTDIR = '/audio/process/input/',
      OUTPUTDIR = '/audio/process/output/';

processSwac = function(res, data) {
  let re, count = 0, line = '', nextLine = '', fileName = '', newFileName = '', prefix = '';

  let setPrefix = function(line) {
    let swacLan = line.replace(/^SWAC_LANG=/, '');
    switch (swacLan) {
      case 'ces': prefix = 'cs-'; break;
      case 'deu': prefix = 'de-'; break;
      case 'nld': prefix = 'nl-'; break;
      case 'fra': prefix = 'fr-'; break;
      case 'ita': prefix = 'it-'; break;
      // case 'eng': prefix = 'gb-'; break; //Region: GB
      case 'eng': prefix = 'us-'; break; //Region: US
      case 'spa': prefix = 'mx-'; break; //Region: Mexico
    }
  }

  dataArr = data.toString().split("\n");
  for (let i = 0; i < dataArr.length; i++) {
    line = dataArr[i];

    re = new RegExp("^SWAC_LANG");
    if (re.test(line)) {
      setPrefix(line);
    }

    re = new RegExp(".flac]$");
    if (re.test(line)) {
      fileName = line.replace(/\[|\]/g, ''); //remove []
      nextLine = dataArr[i + 1];
      re = new RegExp("SWAC_TEXT");
      if (!re.test(nextLine)) {
        nextLine = dataArr[i + 2];
      }
      if (!re.test(nextLine)) {
        nextLine = dataArr[i + 3];
      }
      if (!re.test(nextLine)) {
        nextLine = dataArr[i + 4];
      }
      if (!re.test(nextLine)) {
        nextLine = dataArr[i + 5];
      }
      if (!re.test(nextLine)) {
        nextLine = dataArr[i + 6];
      }
      if (!re.test(nextLine)) {
        nextLine = dataArr[i + 7];
      }
      if (!re.test(nextLine)) {
        nextLine = dataArr[i + 8];
      }
      if (!re.test(nextLine)) {
        nextLine = dataArr[i + 9];
      }
      nextLine = nextLine.replace(/\?/g, ''); //remove ?
      newFileName = prefix + nextLine.replace(/^SWAC_TEXT=/, '') + '.flac'; //remove []
      // console.log('renaming', fileName, 'to', newFileName);
      fs.rename(INPUTDIR + fileName, OUTPUTDIR + newFileName, function(err) {
        if (err) {
          console.log('ERROR: ' + err);
        }
      });
      count++;
    }
  };
  response.handleSuccess(res, {files: count}, 200, 'Processed audio files');
}

module.exports = {
  processFiles: function (req, res) {
    const filePath = INPUTDIR + 'index.tags.txt';
    fs.readFile(filePath, 'utf-8', function (err, data) {
      response.handleError(err, res, 500, 'Error loading Swac file', function(){
        processSwac(res, data);
      });
    });
  }
}
