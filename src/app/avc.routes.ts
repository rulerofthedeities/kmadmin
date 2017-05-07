import {Routes} from '@angular/router';
import {AvcComponent} from './components/avc/avc.component';
import {LanComponent} from './components/avc/lan.component';
import {AvcMenuComponent} from './components/avc/avc-menu.component';
import {CitiesComponent} from './components/avc/cities.component';
import {CityComponent} from './components/avc/city.component';
import {ItemCitiesComponent} from './components/avc/item-cities.component';
import {ItemsComponent} from './components/avc/items.component';
import {ItemComponent} from './components/avc/item.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/avc/cities',
    pathMatch: 'full'},
  {
    path: 'cities', component: AvcMenuComponent,
    children: [
      {path: '', component: CitiesComponent},
      {path: ':lan', component: CitiesComponent},
      {path: ':lan/:city', component: CityComponent}
    ]
  },
  {
    path: 'items', component: AvcMenuComponent,
    children: [
      {path: '', component: ItemCitiesComponent},
      {path: ':lan', component: ItemCitiesComponent},
      {path: ':lan/:city', component: ItemsComponent},
      {path: ':lan/:city/:item', component: ItemComponent}
    ]
  }
];
