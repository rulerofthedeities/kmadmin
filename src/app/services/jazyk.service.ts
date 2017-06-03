import {Injectable, EventEmitter} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CloudFile, DetailFilterData, TpeList, Filter, FilterFiles, LocalFile, LanPair, Language} from '../models/jazyk.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class JazykService {
  detailChanged = new EventEmitter<boolean>();

  constructor(
    private http: Http
  ) {}


/* Sync */

  compareNlWords() {
    // Compare nl words in cznl with nl words in jazyk
    return this.http
    .get('/api/jazyk/sync/compare/words')
    .map(conn => conn.json().obj)
    .catch(error => Observable.throw(error));
  }
  compareNlSentences() {
    // Compare nl sentences in cznl with nl words in jazyk
    return this.http
    .get('/api/jazyk/sync/compare/sentences')
    .map(conn => conn.json().obj)
    .catch(error => Observable.throw(error));
  }
  removeWords() {
    // Remove cn + cz wordpairs and worddetails from jazyk db
    return this.http
    .get('/api/jazyk/sync/removecz')
    .map(conn => conn.json().obj)
    .catch(error => Observable.throw(error));
  }
  addNlWords() {
    // Add nl words from cznl to jazyk
    return this.http
    .get('/api/jazyk/sync/add/words')
    .map(conn => conn.json().obj)
    .catch(error => Observable.throw(error));
  }
  addNlSentences() {
    // Add nl sentences from cznl to jazyk
    return this.http
    .get('/api/jazyk/sync/add/sentences')
    .map(conn => conn.json().obj)
    .catch(error => Observable.throw(error));
  }
/* Wordpairs */

  addWordPair(wordpairData: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
    .post('/api/jazyk/word', JSON.stringify(wordpairData), {headers})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  updateWordPair(wordpairData: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
    .put('/api/jazyk/word', JSON.stringify(wordpairData), {headers})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  checkWordPairExists(filter: DetailFilterData) {
    const params = new URLSearchParams();
    params.set('word1', filter.word1);
    params.set('word2', filter.word2);
    params.set('lanCode1', filter.lan1);
    params.set('lanCode2', filter.lan2);
    params.set('wordTpe', filter.tpe);
    return this.http
    .get('/api/jazyk/wordpair/exists', {search: params})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

/* Filter */

  private getFilterParams(filter: Filter) {
    const params = new URLSearchParams();
    params.set('word', filter.word);
    params.set('lanCode', filter.lanCode);
    params.set('wordTpe', filter.wordTpe);
    params.set('isFromStart', filter.isFromStart.toString());
    params.set('isExact', filter.isExact.toString());
    params.set('returnTotal', filter.returnTotal.toString());
    return params;
  }

  fetchFilterWordPairs(filter: Filter) {
    const params = this.getFilterParams(filter);
    return this.http
    .get('/api/jazyk/wordpairs/', {search: params})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  fetchFilterWordDetails(filter: Filter) {
    const params = this.getFilterParams(filter);
    return this.http
    .get('/api/jazyk/worddetails', {search: params})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }


/* Detail */

  fetchWordDetailByFilter(filter: Filter) {
    const params = new URLSearchParams();
    params.set('word', filter.word);
    params.set('lanCode', filter.lanCode);
    params.set('wordTpe', filter.wordTpe);
    return this.http
    .get('/api/jazyk/worddetail/filter/', {search: params})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  fetchWordDetailById(detailId: string) {
    const params = new URLSearchParams();
    params.set('id', detailId);
    return this.http
    .get('/api/jazyk/worddetail/id/', {search: params})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  addWordDetail(detailFormData: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
    .post('/api/jazyk/detail', JSON.stringify(detailFormData), {headers})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  updateWordDetail(detailFormData: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
    .put('/api/jazyk/detail', JSON.stringify(detailFormData), {headers})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

/* Tags */

  searchTags(search: string, lanPair: string[]) {
    const params = new URLSearchParams();
    params.set('lanpair', lanPair.join(';'));
    params.set('search', search);
    return this.http
      .get('/api/jazyk/tags', {search: params})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

/* Config */

  fetchLanConfig(lanCode: string) {
    return this.http.get('/api/jazyk/config/lan/' + lanCode)
      .map(conn => conn.json().obj)
      .catch(error => Observable.throw(error));
  }

/* File Upload */

  saveFileToCloud(legacyFile: any, tpe: string) {
    console.log('saving to cloud', {file: legacyFile, tpe});
    const file = {
      name: legacyFile.name,
      size: legacyFile.size,
      type: legacyFile.type
    };
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
    .post('/api/jazyk/files/upload', JSON.stringify({file, tpe}), {headers})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  saveCloudFileData(cloudData: CloudFile, localFile: any, tpe: string) {
    const headers = new Headers(),
          format = localFile.type;
    let name = localFile.name.split('.')[0]; // remove extension
    name = name.split('#')[0]; // multiple files with similar name
    if (tpe === 'audio') {
      // remove language code
      name = name.substr(3, name.length - 3);
    }
    const fileData: LocalFile = {
      _id: cloudData._id,
      app: 'jazyk',
      tpe,
      ETag: cloudData.ETag,
      cloudFile: cloudData.Location,
      localFile: localFile.name,
      name,
      format,
      size: localFile.size
    };

    if (tpe === 'audio') {
      const lan2 = localFile.name.split('_')[0];
      const lan1 = lan2 === 'gb' || lan2 === 'us' ? 'en' : lan2;
      fileData.lan = lan1 + '-' + lan2;
    }
    console.log('cloudData', cloudData);
    console.log('fileData', fileData);
    headers.append('Content-Type', 'application/json');
    return this.http
    .post('/api/jazyk/files/add', JSON.stringify(fileData), {headers})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  getLocalFiles(filter: FilterFiles) {
    const params = new URLSearchParams();
    params.set('app', filter.app);
    params.set('tpe', filter.tpe);
    params.set('word', filter.word);
    params.set('isFromStart', filter.isFromStart ? filter.isFromStart.toString() : 'false');
    params.set('isExact', filter.isExact ? filter.isExact.toString() : 'false');
    params.set('returnTotal', filter.returnTotal ? filter.returnTotal.toString() : 'true');
    return this.http
    .get('/api/jazyk/files/', {search: params})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  renameAudioFiles() {
     return this.http
    .get('/api/jazyk/audio')
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

/* Data */

  getLanguages() {
    let languages: Language[];

    languages = [
      {code: 'de', name: 'Duits'},
      {code: 'en', name: 'Engels'},
      {code: 'fr', name: 'Frans'},
      {code: 'nl', name: 'Nederlands'},
      {code: 'cs', name: 'Tsjechisch'}
    ];

    return languages;
  }

  getLanguageName(lanCode: string) {
    return this.getLanguages().filter(lan => lan.code === lanCode)[0].name;
  }

  getFilePath(tpe: string): string {
    let path = '';

    switch (tpe) {
      case 'images' : path = 'http://localhost:4700/images/'; break;
      case 'audio' : path = 'http://localhost:4700/audio/'; break;
    }

    return path;
  }

  getWordTypes() {
    // Put in db
    const tpes = [
      {label: 'Zelfst. naamwoord', val: 'noun'},
      {label: 'Bijv. naamwoord', val: 'adjective'},
      {label: 'Bijwoord', val: 'adverb'},
      {label: 'Werkwoord', val: 'verb'},
      {label: 'Voegwoord', val: 'conjunction'},
      {label: 'Voorzetsel', val: 'preposition'},
      {label: 'Tussenwerpsel', val: 'interjection'},
      {label: 'Voornaamwoord', val: 'pronoun'},
      {label: 'Eigennaam', val: 'propernoun'},
      {label: 'Telwoord', val: 'numeral'},
      {label: 'Partikel', val: 'particle'},
      {label: 'Determiner', val: 'determiner'},
      {label: 'Uitdrukking', val: 'phrase'}
    ];
    return tpes;
  }

}
