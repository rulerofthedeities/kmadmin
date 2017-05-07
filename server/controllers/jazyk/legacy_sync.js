var response = require('../../response'),
    mongoose = require('mongoose'),
    async = require('async'),
    wordCount = require('./wordcount'),
    categories = require('./categories'),
    WordModel = require('../../models/jazyk/word'),
    SentenceModel = require('../../models/jazyk/sentence'),
    CountModel = require('../../models/jazyk/count');

// connect to cznl
const cznlUri = 'mongodb://127.0.0.1:27017/km-cznl',
      jazykUri = 'mongodb://127.0.0.1:27017/km-jazyk',
      countUri = 'mongodb://127.0.0.1:27017/km-wordcounts',
      cznlConn = mongoose.createConnection(cznlUri),
      jazykConn = mongoose.createConnection(jazykUri),
      countConn = mongoose.createConnection(countUri),
      cznlModel = cznlConn.model('Word', WordModel),
      jazykWordModel = jazykConn.model('Word', WordModel),
      jazykSentenceModel = jazykConn.model('Sentence', SentenceModel),
      countModelNl = countConn.model('Count', CountModel, 'nl'),
      countModelCs = countConn.model('Count', CountModel, 'cs');
let addedWords = [];

let frWords = [];
let gbWords = [];
let usWords = [];
let deWords = [];

let wordCnt = 0;

frWords['hond'] = [
  {
    word: 'chien',
    genus: 'M',
    wordCount: 1,
    score: 670
  },
  {
    word: 'chienne',
    genus: 'F',
    wordCount: 1,
    score: 493
  }
];

frWords['kat'] = [
  {
    word: 'chat',
    genus: 'M',
    wordCount: 1,
    score: 604
  }
];

gbWords['hond'] = [
  {
    word: 'dog',
    wordCount: 1,
    score: 679
  }
]

usWords['hond'] = [
  {
    word: 'dog',
    wordCount: 1,
    score: 679
  }
]

deWords['hond'] = [
  {
    word: 'Hunde',
    genus: 'M',
    plural: 'Hunde',
    wordCount: 1,
    score: 550
  }
]

let compareWordDocs = function(req, res, callback) {
  console.log('comparing docs (excluding sentences)');
  cznlModel.count({tpe:{$ne:'zin'}}, function(err, cznlTotal) {
    jazykWordModel.count({}, function(err, jazykTotal) {
      callback(err, {cznl:cznlTotal, jazyk:jazykTotal});
    });
  });
}

let compareSentenceDocs = function(req, res, callback) {
  console.log('comparing docs (only sentences)');
  cznlModel.count({tpe:'zin'}, function(err, cznlTotal) {
    jazykSentenceModel.count({}, function(err, jazykTotal) {
      callback(err, {cznl:cznlTotal, jazyk:jazykTotal});
    });
  });
}

let addWordDocs = function(req, res, callback) {
  console.log('adding words');
  addedWords = [];
  cznlModel.find({tpe:{$ne:'zin'}}, {tpe:1, nl:1, cz:1, nlP:1, czP:1, categories:1}, function(err, cznlWords) {
    //cznlWords = cznlWords.slice(0, 2000);
    async.eachSeries(cznlWords, addWord, function (err) {
      callback(err, {added:addedWords.length});
    });
  });
}

let addSentenceDocs = function(req, res, callback) {
  console.log('adding sentences');
  addedSentences = [];
  cznlModel.find({tpe:'zin'}, {nl:1, cz:1}, function(err, cznlSentences) {
    async.eachSeries(cznlSentences, addSentence, function (err) {
      callback(err, {added:addedSentences.length});
    });
  });
}

let addWord = function(word, callback) {
  jazykWordModel.findOne({_id:word._id}, {}, function(err, jazykWord) {
    if (!jazykWord) {
      // console.log('Adding word', ++wordCnt, word.nl.word);
      addNewWord(word, callback);
    } else {
      callback(err)
    }
  })
}

let addSentence = function(sentence, callback) {
  jazykSentenceModel.findOne({_id:sentence._id}, {}, function(err, jazykSentence) {
    if (!jazykSentence) {
      addNewSentence(sentence, callback);
    } else {
      callback(err)
    }
  })
}

let addNewSentence = function(sentence, callback) {
  let newSentence = {
    _id: sentence._id,
    nl: {
      sentence: sentence.nl.word,
    },
    cs: {
      sentence: sentence.cz.word,
    }
  }

  if (sentence.nl.otherwords) {
    newSentence.nl.alt = sentence.nl.otherwords
  }
  if (sentence.nl.hint) {
    newSentence.nl.hint = sentence.nl.hint
  }
  if (sentence.nl.info) {
    newSentence.nl.info = sentence.nl.info
  }
  if (sentence.cz.otherwords) {
    newSentence.cs.alt = sentence.cz.otherwords
  }
  if (sentence.cz.hint) {
    newSentence.cs.hint = sentence.cz.hint
  }
  if (sentence.cz.info) {
    newSentence.cs.info = sentence.cz.info
  }

  // Get word count for all words cz
  wordCount.getWordCount(newSentence.cs.sentence, countModelCs, function(err, countData){
    newSentence.cs.wordCount = countData.wordCount;
    newSentence.cs.score = countData.score;
    
    // Get word count for all words nl
    wordCount.getWordCount(newSentence.nl.sentence, countModelNl, function(err, countData){
      newSentence.nl.wordCount = countData.wordCount;
      newSentence.nl.score = countData.score;

      //Insert new sentence
      jazykSentenceModel.create(newSentence, function (err, result) {
        if (!err) {
          console.log('Added to jazyk:', addedSentences.length, newSentence.nl.sentence);
          addedSentences.push(newSentence);
        } else {
          console.log('failed to add sentence', newSentence);
          console.log(err);
        }
        callback(err);
      });
    });
  });
}

let addNewWord = function(word, callback) {
  //Create new word
  let newWord = {
    _id: word._id,
    tpe: word.tpe,
    nl: {
      word: word.nl.word,
    },
    cs:[]
  }
  //NL
  if (word.nl.article && word.tpe === "noun") {
    newWord.nl.article = word.nl.article
  }
  // CZ
  let czword = addCzData(word, 'cz');
  let czPword = addCzPData(word, czword);

  //Add Categories
  categories.getCategories(word.categories, function(newCategories) {
    // Add categories to word object
    if (newCategories.length > 0) {
      newWord.categories = newCategories;
    }
  })

  if (word.nl.word !== 'filter' && word.nl.word !== 'pop') {
    if (frWords[word.nl.word]) {
      //Add French words
      newWord.fr = frWords[word.nl.word];
    }

    if (gbWords[word.nl.word]) {
      //Add English words
      newWord.gb = gbWords[word.nl.word];
    }

    if (deWords[word.nl.word]) {
      //Add English words
      newWord.de = deWords[word.nl.word];
    }
  }

  // Get word count for all words cz
  wordCount.getWordCount(czword.word, countModelCs, function(err, countData){
    czword.wordCount = countData.wordCount;
    czword.score = countData.score;
    newWord.cs.push(czword);

    // Get word count for all words czP
    let czpw = czPword ? czPword.word : null;
    wordCount.getWordCount(czpw, countModelCs, function(err, countData){
      if (czpw) {
        czPword.wordCount = countData.wordCount;
        czPword.score = countData.score;
        newWord.cs.push(czPword);
      }

      // Get word count for all words nl
      wordCount.getWordCount(newWord.nl.word, countModelNl, function(err, countData){
        newWord.nl.wordCount = countData.wordCount;
        newWord.nl.score = countData.score;
        //console.log('Added:', newWord);

        //Insert new word
        jazykWordModel.create(newWord, function (err, result) {
          if (!err) {
            // console.log('Added to jazyk:', addedWords.length, newWord.nl.word);
            addedWords.push(word);
          } else {
            console.log('failed to add word', newWord);
            console.log(err);
          }
          callback(err);
        })
        
        // callback(err);
      })
    })
  })
}

let joinInfoHint = function(info, hint) {
  let newInfo = '';
  if (info && hint) {
    newInfo = hint + ';' + info;
  } else {
    if (info) {
      newInfo = info;
    } else {
      newInfo = hint
    }
  }
  return newInfo;
}

let addCzData = function(word, tpe) {
  let czword = {word: word[tpe].word};
  if (word.cz.genus && word.tpe === "noun") {
    czword.genus = word.cz.genus
  }
  if (word[tpe].case) {
    czword.case = word[tpe].case
  }
  if (word.cz.diminutive && word.tpe === "noun") {
    czword.diminutive = word.cz.diminutive
  }
  if (word.cz.plural && word.tpe === "noun") {
    czword.plural = word.cz.plural
  }
  if (word.nl.otherwords || word.nl.info || word.nl.hint) {
    czword.fromNl = {};
    if (word.nl.info) {
      czword.fromNl.info = word.nl.info;
    }
    if (word.nl.hint) {
      czword.fromNl.hint = word.nl.hint
    }
    if (word.nl.otherwords) {
      czword.fromNl.alt = word.nl.otherwords.replace(',', ';');
    }
  }
  if (word[tpe].otherwords || word[tpe].info || word[tpe].hint) {
    czword.toNl = {};
    if (word[tpe].info) {
      czword.toNl.info = word[tpe].info;
    }
    if (word[tpe].hint) {
      czword.toNl.hint = word[tpe].hint;
    }
    if (word[tpe].otherwords) {
      czword.toNl.alt = word[tpe].otherwords.replace(',', ';');
    }
  }
  if (word.tpe === "verb") {
    czword.aspect = word.perfective ? 'p' : (tpe === 'cz' ? 'i' : 'p');
    if (word[tpe].firstpersonsingular) {
      czword.firstpersonsingular = word[tpe].firstpersonsingular;
    }
  }
  return czword;
}

let addCzPData = function(word, czword) {
  let czpword;

  if (word.tpe==='verb' && !word.perfective) {
    if (!word.nlP && word.czP && word.czP.word) {
      // Perfective verbs are the same, use same data
      czpword = addCzData(word, 'czP');
      czpword.aspectPair = word.cz.word;
      czword.aspectPair = czpword.word;
    } else {
      if (word.czP) {
        // Should be different words in source -> split
        console.log('VERB', word.cz.word, 'SHOULD BE SEPARATED');
      }
    }
  }
  return czpword;
}

module.exports = {
  compareWords : function(req, res) {
    compareWordDocs(req, res, function(err, result) {
      response.handleError(err, res, 500, 'Error comparing words', function(){
        response.handleSuccess(res, result, 200, 'Compared words');
      });
    })
  },
  compareSentences : function(req, res) {
    compareSentenceDocs(req, res, function(err, result) {
      response.handleError(err, res, 500, 'Error comparing sentences', function(){
        response.handleSuccess(res, result, 200, 'Compared sentences');
      });
    })
  },
  addWords : function(req, res) {
    addWordDocs(req, res, function(err, result) {
      response.handleError(err, res, 500, 'Error adding words', function(){
        response.handleSuccess(res, result, 200, 'added words');
      });
    });
  },
  addSentences : function(req, res) {
    addSentenceDocs(req, res, function(err, result) {
      response.handleError(err, res, 500, 'Error adding sentences', function(){
        response.handleSuccess(res, result, 200, 'added sentences');
      });
    });
  }
}
