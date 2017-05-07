import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AvcService} from '../../services/avc.service';
import {ErrorService} from '../../services/error.service';
import {City} from '../../models/avc.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'km-city',
  templateUrl: 'city.component.html',
  styleUrls: ['form.component.css']
})

export class CityComponent implements OnInit, OnDestroy {
  componentActive = true;
  isNew = false;
  city: City;
  cityForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private avcService: AvcService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.activatedRoute.params
    .takeWhile(() => this.componentActive)
    .subscribe(
      params => {
        const lan = params['lan'],
              cityAlias = params['city'];
        this.fetchCity(cityAlias, lan);
      }
    );
  }
  fetchCity(cityAlias: string, lan: string) {
    this.avcService
    .fetchCity(cityAlias, lan)
    .takeWhile(() => this.componentActive)
    .subscribe(
      city => {
        this.city = city;
        this.buildForm(city);
      },
      error => this.errorService.handleError(error)
    );
  }

  buildForm(city: City) {
    if (!city.state) {
      city.state = {name: '', code: ''};
    }
    this.cityForm = this.formBuilder.group({
      _id: [city._id],
      lan: [city.lan],
      alias: [city.alias, [Validators.required]],
      name: [city.name, [Validators.required]],
      stateName: [city.state.name],
      stateCode: [city.state.code],
      country: [city.country, [Validators.required]],
      icon: [city.icon],
      location: [city.pos.coordinates.join(',')],
      zoom: [city.zoom],
      flag: [city.flag],
      currencyName: [city.currency.name],
      currencyCode: [city.currency.code],
      altitudeMeter: [city.altitude.m],
      altitudeFt: [city.altitude.ft],
      timezoneOffset: [city.timezone.offset],
      timezoneCode: [city.timezone.code],
      timezoneName: [city.timezone.name],
      timezoneZone: [city.timezone.zone],
      language: [city.language],
      locationDescr: [city.location.descr],
      locationImg: [city.location.img],
      localName: [city.localName],
      coordinates: [city.coordinates],
      eanCityID: [city.affiliate.eanCityID],
      viatorPage: [city.affiliate.viatorPage],
      carRental: [city.affiliate.carRental],
      intro: [city.intro],
      isPublish: [city.publish]
    });
  }

  onSubmit(cityForm: any) {
    if (this.isNew) {

    } else {
      this.updateCity(cityForm.value);
    }
  }

  updateCity(cityFormData: any) {
    this.avcService
    .updateCity(cityFormData)
    .takeWhile(() => this.componentActive)
    .subscribe(
      city => {
        // this.submitMessage = `Het woord ${wordPair.cz.word}/${wordPair.nl.word} is succesvol aangepast.`;
        this.isNew = false;
      },
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
