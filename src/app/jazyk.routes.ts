import {Routes} from '@angular/router';
import {JazykMenuComponent} from './components/jazyk/menu.component';
import {CznlImportComponent} from './components/jazyk/cznl-import.component';
import {JazykEditComponent} from './components/jazyk/edit.component';
import {JazykEditMenuComponent} from './components/jazyk/edit-menu.component';

export const routes: Routes = [
  {
    path: '',
    component: JazykMenuComponent,
    children: [
      {path: 'import', component: CznlImportComponent},
      {
        path: 'edit',
        component: JazykEditMenuComponent,
        children: [
          {path: 'wordpairs', component: JazykEditComponent},
          {path: 'worddetails', component: JazykEditComponent}
        ]
      }
    ]
  }
];
