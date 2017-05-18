import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {DetailFilterData, TpeList, Filter, LanPair, Language} from '../models/jazyk.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class JazykService {

  constructor(
    private http: Http
  ) {}


/* Sync */

  compareNlWords() {
    // Compare nl words in cznl with nl words in jazyk
    return this.http.get('/api/jazyk/sync/compare/words')
      .map(conn => conn.json().obj)
      .catch(error => Observable.throw(error));
  }
  compareNlSentences() {
    // Compare nl sentences in cznl with nl words in jazyk
    return this.http.get('/api/jazyk/sync/compare/sentences')
      .map(conn => conn.json().obj)
      .catch(error => Observable.throw(error));
  }
  removeWords() {
    // Remove cn + cz wordpairs and worddetails from jazyk db
    return this.http.get('/api/jazyk/sync/removecz')
      .map(conn => conn.json().obj)
      .catch(error => Observable.throw(error));
  }
  addNlWords() {
    // Add nl words from cznl to jazyk
    return this.http.get('/api/jazyk/sync/add/words')
      .map(conn => conn.json().obj)
      .catch(error => Observable.throw(error));
  }
  addNlSentences() {
    // Add nl sentences from cznl to jazyk
    return this.http.get('/api/jazyk/sync/add/sentences')
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

/*
  fetchWordPairDetail(wordpairId: string) {
    return this.http
    .get('/api/jazyk/wordpair/' + wordpairId)
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }
  */

/* Config */

  fetchLanConfig(lanCode: string) {
    return this.http.get('/api/jazyk/config/lan/' + lanCode)
      .map(conn => conn.json().obj)
      .catch(error => Observable.throw(error));
  }



/* Data */

  getLanguages(short: boolean) {
    let languages: Language[];

    languages = [
      {code: this.getShortLanguage('en-us', short), name: 'Amerikaans Engels'},
      {code: this.getShortLanguage('en-gb', short), name: 'Brits Engels'},
      {code: this.getShortLanguage('de-de', short), name: 'Duits'},
      {code: this.getShortLanguage('nl-nl', short), name: 'Nederlands'},
      {code: this.getShortLanguage('fr-fr', short), name: 'Frans'},
      {code: this.getShortLanguage('cs-cz', short), name: 'Tsjechisch'}
    ];

    return languages;
  }

  getShortLanguage(lan: string, short: boolean): string {
    const lanCode = short ? lan.slice(0, 2) : lan;
    return lanCode;
  }

  getLanguageName(lanCode: string) {
    return this.getLanguages(false).filter(lan => lan.code === lanCode)[0].name;
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
