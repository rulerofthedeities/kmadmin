import {Routes} from '@angular/router';
import {JazykMenuComponent} from './components/jazyk/menu.component';
import {CznlImportComponent} from './components/jazyk/cznl-import.component';
import {JazykEditComponent} from './components/jazyk/edit.component';
import {JazykEditMenuComponent} from './components/jazyk/edit-menu.component';
import {JazykFilesComponent} from './components/jazyk/files.component';
import {JazykFilesMenuComponent} from './components/jazyk/files-menu.component';
import {JazykProcessAudioComponent} from './components/jazyk/process-audio.component';

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
          {path: 'wordpairs', component: JazykEditComponent, data : {tpe : 'wordpairs'}},
          {path: 'worddetails', component: JazykEditComponent, data : {tpe : 'worddetails'}}
        ]
      },
      {
        path: 'files',
        component: JazykFilesMenuComponent,
        children: [
          {path: 'images', component: JazykFilesComponent, data : {tpe : 'images'}},
          {path: 'audio', component: JazykFilesComponent, data : {tpe : 'audio'}},
          {path: 'processaudio', component: JazykProcessAudioComponent}
        ]
      }
    ]
  }
];
