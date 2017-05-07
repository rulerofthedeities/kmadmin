import {Routes} from '@angular/router';
import {JazykMenuComponent} from './components/jazyk/menu.component';
import {CznlImportComponent} from './components/jazyk/cznl-import.component';
import {JazykEditComponent} from './components/jazyk/edit.component';

export const routes: Routes = [
  {
    path: '',
    component: JazykMenuComponent,
    children: [
      {path: 'import', component: CznlImportComponent},
      {
        path: 'edit',
        component: JazykEditComponent
      }
    ]
  }
];
