import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AvcService} from '../../services/avc.service';
import {ErrorService} from '../../services/error.service';
import {City} from '../../models/avc.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  template: `
    <div *ngIf="cities">
      <strong>Cities for {{lan}}</strong>
      <div *ngFor="let city of cities" class="city" (click)="onSelectCity(city.alias.en)">
        {{city.name.en}}
      </div>
    </div>
  `,
  styles: [`
    .city, .back {
      cursor: pointer;
    }
  `]
})

export class ItemCitiesComponent implements OnInit, OnDestroy {
  componentActive = true;
  lan: string;
  cities: City[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private avcService: AvcService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.activatedRoute.params
    .takeWhile(() => this.componentActive)
    .subscribe(
      params => {
        const lan = params['lan'];
        this.lan = lan;
        this.fetchCities(lan);
      }
    );
  }

  onSelectCity(cityAlias: string) {
    this.router.navigate([cityAlias], {relativeTo: this.activatedRoute});
  }

  fetchCities(lan: string) {
    this.avcService
    .fetchCityList(lan)
    .takeWhile(() => this.componentActive)
    .subscribe(
      cities => {
        this.cities = cities;
      },
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
