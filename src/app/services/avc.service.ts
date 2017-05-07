import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AvcService {

  constructor(
    private http: Http
  ) {}

// CITIES

  fetchCityList(lan: string) {
    return this.http
    .get('/api/avc/cities/' + lan)
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  fetchCity(cityAlias: string, lan: string) {
    return this.http
    .get('/api/avc/city/' + cityAlias + '/' + lan)
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  updateCity(cityData: any) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    return this.http
      .put('/api/avc/city/update', JSON.stringify(cityData), {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

// ITEMS

  fetchItemList(cityAlias: string, lan: string) {
    return this.http
    .get('/api/avc/items/' + cityAlias + '/' + lan)
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  fetchItem(cityAlias: string, itemAlias: string, lan: string) {
    return this.http
    .get('/api/avc/item/' + cityAlias + '/' + itemAlias + '/' + lan)
    .map(response => response.json().obj)
    .catch(error => Observable.throw(error));
  }

  updateItem(itemData: any) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    return this.http
      .put('/api/avc/item/update', JSON.stringify(itemData), {headers})
      .map(response => response.json().obj)
      .catch(error => Observable.throw(error));
  }

}
