let async = require('async'),
    countModel = null,
    countData = null;

getSingleWordCountSync = function(word, callback) {
  let countWord = word.toLowerCase();
  countModel.findOne({_id: countWord}, {_id:0, score:1}, function(err, count) {
    countData.wordCount = countData.wordCount + 1;
    if (count) {
      countData.score = countData.score + count.score;
    }
    callback();
  });
}

module.exports = {
  getWordCount: function(word, model, callback) {
    countModel = model;
    countData = {
      wordCount: 0,
      score: 0
    };
    // If there are multiple words, split them uo
    if (word) {
      let searchwords = word.replace('-', ' ').split(' ');
      /*if (searchwords.length > 1) {
        console.log('multiple words', searchwords);
      }*/
      async.eachSeries(searchwords, getSingleWordCountSync, function (err, count) {
      //average score
        if (countData.wordCount > 1) {
          countData.score = Math.round(countData.score / countData.wordCount);
        }
        callback(err, countData);
      });
    } else {
      callback(null, countData);
    }
  }
}
