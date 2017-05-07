import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Connection, Profile} from '../models/mongosync.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class SyncService {

  constructor(
    private _http: Http
  ) {}

  getConnections() {
    return this._http
    .get('/api/sync/connections')
    .map(conn => conn.json().obj)
    .catch(error => Observable.throw(error));
  }

  getDatabases(connId: string) {
    return this._http.get('/api/sync/databases/' + connId)
      .map(dbs => dbs.json().obj)
      .catch(error => Observable.throw(error));
  }

  getCollections(connId: string, dbName: string) {
    return this._http.get('/api/sync/collections/' + connId + '/' + dbName)
      .map(coll => coll.json().obj)
      .catch(error => Observable.throw(error));
  }

  addConnection(conn: Connection) {
    const body = JSON.stringify(conn),
          headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this._http
    .put('/api/sync/connections', body, {headers})
    .map(result => {console.log('result', result); })
    .catch(error => Observable.throw(error));
  }

  compare(connIdSrc: string, connIdTgt: string, dbName: string, collName: string) {
    return this._http
    .get('/api/sync/compare/' + connIdSrc + '/' + connIdTgt + '/' + dbName + '/' + collName)
    .map(docs => docs.json().obj)
    .catch(error => Observable.throw(error));
  }

  addDocuments(docs: string[], connIdTgt: string, dbName: string, collName: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
    .post('/api/sync/add/' + connIdTgt + '/' + dbName + '/' + collName, JSON.stringify(docs), {headers})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  updateDocuments(docs: string[], connIdTgt: string, dbName: string, collName: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
    .put('/api/sync/update/' + connIdTgt + '/' + dbName + '/' + collName, JSON.stringify(docs), {headers})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  saveProfile(profile: Profile) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
    .post('/api/sync/profiles/save', JSON.stringify(profile), {headers})
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  removeDocument(docId: string, connIdTgt: string, dbName: string, collName: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
      .delete('/api/sync/delete/' + connIdTgt + '/' + dbName + '/' + collName + '/' + docId)
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

  getProfiles() {
    return this._http.get('/api/sync/profiles')
      .map(coll => coll.json().obj)
      .catch(error => Observable.throw(error));
  }
}
