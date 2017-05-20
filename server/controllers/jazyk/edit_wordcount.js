let async = require('async'),
    countModel = require('../../models/jazyk/count'),
    countData = null,
    countWord, searchwords;

getSingleWordCount = function(word, callback) {
  countWord = word.toLowerCase();
  
  CountModel.findOne({_id: countWord}, {_id:0, score:1}, function(err, count) {
    countData.wordCount = countData.wordCount + 1;
    if (count) {
      countData.score = countData.score + count.score;
    }
    callback();
  });
}

module.exports = {
  getWordCount: function(wordObj, countConn, callback) {
    countData = {
      wordCount: 0,
      score: 0
    };
    // If there are multiple words, split them up
    if (wordObj && wordObj.word) {
      word = wordObj.word;
      CountModel = countConn.model('Count', countModel, wordObj.lan);
      searchwords = word.replace('-', ' ').split(' ');
      async.eachSeries(searchwords, getSingleWordCount, function (err, count) {
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
