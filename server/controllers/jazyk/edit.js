const response = require('../../response'),
      mongoose = require('mongoose'),
      WordPairModel = require('../../models/jazyk/wordpair'),
      WordDetailModel = require('../../models/jazyk/worddetail');
// connect to jazyk db 
const jazykUri = 'mongodb://127.0.0.1:27017/km-jazyk',
      jazykConn = mongoose.createConnection(jazykUri),
      WordPair = jazykConn.model('WordPair', WordPairModel, "wordpairs"),
      WordDetail = jazykConn.model('WordDetail', WordDetailModel, "wordpairs");

/*
getDetailById= function(word, callback) {
  let detail = null;
  if (word.detailId) {
    WordDetail.findOne({_id: word.detailId}, {}, function(err, worddetail) {
      callback(err, worddetail);
    });
  } else {
    callback(null, detail);
  }
}
*/

module.exports = {
  getWordPairs: function(req, res) {
    const query = req.query;
    const returnTotal = query.returnTotal === 'true' ? true : false;
    const word = query.isFromStart === 'true' ? "^" + query.word : query.word;
    const lan = query.lanCode;
    const key = query.lanCode.slice(0, 2) + '.word';
    const search = query.isExact === 'true' ? query.word : {$regex: word, $options:'i'};
    
    WordPair.find({lanPair:lan, [key]:search}, {}, {limit: 50, sort:{[key]:1}}, function(err, wordpairs) {
      response.handleError(err, res, 500, 'Error fetching wordpairs', function(){
        // Count workaround until v3.4 (aggregate)
        if (returnTotal) {
          WordPair.count({lanPair: lan, [key]:search}, function(err, total) {
            response.handleError(err, res, 500, 'Error fetching wordpairs total', function(){
              response.handleSuccess(res, {wordpairs, total}, 200, 'Fetched wordpairs');
            });
          });
        } else {
          response.handleSuccess(res, {wordpairs, total:0}, 200, 'Fetched wordpairs');
        }
      });
    });
  },
  getWordDetail: function(req, res) {
    const query = req.query,
          wordTpe = query.wordTpe,
          word = query.word,
          lan = query.lanCode.slice(0, 2);
    WordDetail.find({docTpe:'details', lan:lan, wordTpe: wordTpe, word:word}, {}, {limit: 5}, function(err, worddetails) {
      response.handleError(err, res, 500, 'Error fetching worddetails', function(){
        response.handleSuccess(res, worddetails, 200, 'Fetched worddetails');
      });
    });
  },
/*
  getWordPairDetail: function(req, res) {
    const wordpairId = new mongoose.Types.ObjectId(req.params.id);
    WordPair.findOne({_id: wordpairId}, {}, function(err, wordpair) {
      //get detail docs
      languages = [];
      languages[0] = wordpair.lanPair[0].slice(0, 2);
      languages[1] = wordpair.lanPair[1].slice(0, 2);
      getDetailById(wordpair[languages[0]], function(err, detail0) {
        getDetailById(wordpair[languages[1]], function(err, detail1) {
          words = {wordPair:wordpair, [languages[0]]:detail0, [languages[1]]:detail1};
          response.handleError(err, res, 500, 'Error fetching wordpair', function(){
            response.handleSuccess(res, words, 200, 'Fetched wordpair');
          });
        });
      });

    });
  },*/
  addWordPair: function(req, res) {
    console.log('Form data:', req.body);
    // ADD MAIN WORDPAIR DOCUMENT

    // ADD WORDPAIR DETAIL DOCUMENTS 
    // only if it doesn't exist already
    // detail is constant, regardless of language pair!!


    err = null;
    result = null;
    response.handleError(err, res, 500, 'Error fetching wordpair', function(){
      response.handleSuccess(res, result, 200, 'Fetched wordpair');
    });
  }
}
