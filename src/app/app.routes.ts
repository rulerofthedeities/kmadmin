import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'mongosync', loadChildren: './sync.module#SyncModule'},
      {path: 'jazyk', loadChildren: './jazyk.module#JazykModule'},
      {path: 'avc', loadChildren: './avc.module#AvcModule'}
    ]
  }
];
