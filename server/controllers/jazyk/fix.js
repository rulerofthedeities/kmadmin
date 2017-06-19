const response = require('../../response'),
      mongoose = require('mongoose'),
      async = require('async'),
      WordPairModel = require('../../models/jazyk/wordpair'),
      WordDetailModel = require('../../models/jazyk/worddetail');
// connect to jazyk db 
const jazykUri = 'mongodb://127.0.0.1:27017/km-jazyk',
      jazykConn = mongoose.createConnection(jazykUri),
      WordPair = jazykConn.model('WordPair', WordPairModel, "wordpairs"),
      WordDetail = jazykConn.model('WordDetail', WordDetailModel, "wordpairs");

let updatedWords = [];

let processWord = function(word, callback) {
  console.log('Update word', word._id, word.nl.word, word.cs.word);
  const wordpairId = new mongoose.Types.ObjectId(word._id);
  console.log('Update word', wordpairId);
  WordPair.findOneAndUpdate(
    {_id: wordpairId},
    {$set: {'cs.wordTpe': word.wordTpe, 'nl.wordTpe': word.wordTpe}, $unset: {wordTpe: null}}
  )

  updatedWords.push(word);
  callback(null)
}

module.exports = {
  movetpe: function(req, res) {
    //Move wordtpe to cs / nl
    q = {
      docTpe: 'wordpair', 
      wordTpe: {$exists: true}
    };

    console.log('getting wordpairs with wordTpe');

    WordPair.find(q, function(err, wordpairs) {
      updatedWords = [];
      wordpairs = wordpairs.slice(0, 1);
      async.eachSeries(wordpairs, processWord, function (err) {
        response.handleError(err, res, 500, 'Error updating words', function(){
          response.handleSuccess(res, {updated: updatedWords.length}, 200, 'updated words');
        });
      });
    })
  }
}
