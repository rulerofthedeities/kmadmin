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

let createLanDoc = function(formData, nr) {
  let lanDoc = {
    word: formData['word' + nr].trim()
  };
  if (formData['alt' + nr]) {
    lanDoc.alt = formData['alt' + nr];
  }
  if (formData['hint' + nr]) {
    lanDoc.hint = formData['hint' + nr].trim();
  }
  if (formData['info' + nr]) {
    lanDoc.info = formData['info' + nr].trim();
  }
  if (formData['detailId' + nr]) {
    lanDoc.detailId = new mongoose.Types.ObjectId(formData['detailId' + nr]);
  }
  return lanDoc;
}

let updateLanDoc = function(formData, nr) {
  let lanDoc = {
    word: formData['word' + nr].trim()
  };
  lanDoc.alt = formData['alt' + nr] ? formData['alt' + nr] : undefined;
  lanDoc.hint = formData['hint' + nr] ? formData['hint' + nr].trim() : undefined;
  lanDoc.info = formData['info' + nr] ? formData['info' + nr].trim() : undefined;
  lanDoc.detailId = formData['detailId' + nr] ? new mongoose.Types.ObjectId(formData['detailId' + nr]) : undefined;

  return lanDoc;
}

module.exports = {
  getWordPairs: function(req, res) {
    //For wordpair list
    const query = req.query;
    const returnTotal = query.returnTotal === 'true' ? true : false;
    const word = query.isFromStart === 'true' ? "^" + query.word : query.word;
    const lan = query.lanCode;
    const key = query.lanCode.slice(0, 2) + '.word';
    const search = query.isExact === 'true' ? query.word : {$regex: word, $options:'i'};

    const q = {docTpe:'wordpair', lanPair:lan, [key]:search};
    if (query.wordTpe) {
      q.wordTpe = query.wordTpe;
    }
    
    WordPair.find(q, {}, {limit: 50, sort:{[key]:1, lanPair:1}}, function(err, wordpairs) {
      response.handleError(err, res, 500, 'Error fetching wordpairs', function(){
        // Count workaround until v3.4 (aggregate)
        if (returnTotal) {
          WordPair.count(q, function(err, total) {
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
  getWordDetails: function(req, res) {
    //For worddetail list
    const query = req.query;
    const returnTotal = query.returnTotal === 'true' ? true : false;
    const word = query.isFromStart === 'true' ? "^" + query.word : query.word;
    const lan = query.lanCode.slice(0, 2);
    const search = query.isExact === 'true' ? query.word : {$regex: word, $options:'i'};

    const q = {docTpe:'details', lan:lan, word:search};
    if (query.wordTpe) {
      q.wordTpe = query.wordTpe;
    }
    
    WordDetail.find(q, {}, {limit: 50, sort:{word:1}}, function(err, worddetails) {
      response.handleError(err, res, 500, 'Error fetching worddetails', function(){
        // Count workaround until v3.4 (aggregate)
        if (returnTotal) {
          WordDetail.count(q, function(err, total) {
            response.handleError(err, res, 500, 'Error fetching worddetails total', function(){
              response.handleSuccess(res, {worddetails, total}, 200, 'Fetched worddetails');
            });
          });
        } else {
          response.handleSuccess(res, {worddetails, total:0}, 200, 'Fetched worddetails');
        }
      });
    });
  },
  getWordDetailByFilter: function(req, res) {
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
  getWordDetailById: function(req, res) {
    const detailId = req.query.id;
    WordDetail.findOne({_id:detailId}, {__v:0}, {}, function(err, worddetails) {
      response.handleError(err, res, 500, 'Error fetching worddetails', function(){
        response.handleSuccess(res, worddetails, 200, 'Fetched worddetails');
      });
    });
  },
  checkWordpairExists: function(req, res) {
    const query = req.query,
          wordTpe = query.wordTpe,
          lan1 = query.lanCode1,
          lan2 = query.lanCode2,
          word1 = query.word1,
          word2 = query.word2,
          wordkey1 = lan1.slice(0, 2) + '.word',
          wordkey2 = lan2.slice(0, 2) + '.word';

    WordPair.findOne({docTpe:'wordpair', wordTpe: wordTpe, $and:[{lanPair:lan1}, {lanPair:lan2}], [wordkey1]:word1, [wordkey2]:word2}, {}, {}, function(err, wordpair) {
      result = wordpair ? wordpair._id : false;
      response.handleError(err, res, 500, 'Error checking wordpair exists', function(){
        response.handleSuccess(res, result, 200, 'Checked if wordpair exists');
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
    const formData = req.body,
          lankey1 = formData.lan1.slice(0, 2),
          lankey2 = formData.lan2.slice(0, 2),
          landoc1 = createLanDoc(formData, 1),
          landoc2 = createLanDoc(formData, 2);

    // ADD MAIN WORDPAIR DOCUMENT
    const newWord = {
      docTpe: 'wordpair',
      wordTpe: formData.wordTpe,
      lanPair: [formData.lan1, formData.lan2],
      [lankey1]: landoc1,
      [lankey2]: landoc2
    }
    console.log('Add Wordpair Form data:', req.body);
    console.log('Add Wordpair New document:', newWord);

    WordPair.create(newWord, function (err, result) {
      response.handleError(err, res, 500, 'Error adding wordpair', function(){
        response.handleSuccess(res, result, 200, 'Added wordpair');
      });
    });
  },
  updateWordPair: function(req, res) {
    const formData = req.body,
          lankey1 = formData.lan1.slice(0, 2),
          lankey2 = formData.lan2.slice(0, 2),
          landoc1 = updateLanDoc(formData, 1),
          landoc2 = updateLanDoc(formData, 2);
    let wordpairId;
    // GET WORDCOUNT

    console.log('update Wordpair Form data:', req.body);
    if (mongoose.Types.ObjectId.isValid(formData._id)) {
      wordpairId = new mongoose.Types.ObjectId(formData._id);
    } else {
      console.log('ERROR: invalid wordpair ID "' + formData._id + '"');
    }

    const UpdateObject = {
      wordTpe: formData.wordTpe,
      [lankey1]: landoc1,
      [lankey2]: landoc2
    }
    console.log('Update Wordpair Object:', UpdateObject);

    WordPair.findOneAndUpdate({_id: wordpairId}, {$set: UpdateObject}, function(err, result) {
      response.handleError(err, res, 500, 'Error updating wordpair', function(){
        response.handleSuccess(res, result, 200, 'Updating wordpair');
      });
    });

  },
  addWordDetail: function(req, res) {
    const formData = req.body;

    // GET WORDCOUNT


    // ADD WORDDETAIL DOCUMENT

    const newWord = {
      docTpe: 'details',
      wordTpe: formData.wordTpe,
      lan: formData.lan,
      word: formData.word
    }

    if (formData.article) {
      newWord.article = formData.article
    }
    if (formData.genus) {
      newWord.genus = formData.genus
    }

    console.log('Add Worddetail Form data:', req.body);
    console.log('Add Worddetail New document:', newWord);

    WordDetail.create(newWord, function (err, result) {
      response.handleError(err, res, 500, 'Error adding worddetail', function() {
        response.handleSuccess(res, result, 200, 'Added worddetail');
      });
    });
  },
  updateWordDetail: function(req, res) {
    const formData = req.body;
    let worddetailId;

    if (mongoose.Types.ObjectId.isValid(formData._id)) {
      worddetailId = new mongoose.Types.ObjectId(formData._id);
    } else {
      console.log('ERROR: invalid worddetail ID "' + formData._id + '"');
    }

    console.log('update Worddetail Form data:', req.body);

    const updateObject = {wordTpe: formData.wordTpe},
          removeObject = {};

    // ADD VALUES

    if (formData.article !== undefined) {
      updateObject.article = formData.article;
    }
    if (formData.genus !== undefined) {
      updateObject.genus = formData.genus;
    }

    // REMOVE VALUES

    if (formData.article === undefined) {
      removeObject.article = formData.article;
    }
    if (formData.genus === undefined) {
      removeObject.genus = formData.genus;
    }

    WordDetail.findOneAndUpdate({_id: worddetailId}, {$set: updateObject, $unset: removeObject}, function(err, result) {
      response.handleError(err, res, 500, 'Error updating worddetail', function(){
        response.handleSuccess(res, result, 200, 'Updated worddetail');
      });
    });
  }
}
