import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {routes} from './avc.routes';

import {ErrorService} from './services/error.service';
import {AvcService} from './services/avc.service';

import {AvcComponent} from './components/avc/avc.component';
import {AvcMenuComponent} from './components/avc/avc-menu.component';
import {LanComponent} from './components/avc/lan.component';
import {CitiesComponent} from './components/avc/cities.component';
import {CityComponent} from './components/avc/city.component';
import {ItemCitiesComponent} from './components/avc/item-cities.component';
import {ItemsComponent} from './components/avc/items.component';
import {ItemComponent} from './components/avc/item.component';


@NgModule({
  imports: [
    SharedModule,
    HttpModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ErrorService,
    AvcService
  ],
  declarations: [
    AvcComponent,
    AvcMenuComponent,
    LanComponent,
    CitiesComponent,
    CityComponent,
    ItemCitiesComponent,
    ItemsComponent,
    ItemComponent
  ]
})
export class AvcModule {}
