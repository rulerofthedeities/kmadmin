import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {routes} from './sync.routes';

import {ErrorService} from './services/error.service';
import {SyncService} from './services/sync.service';

import {MongoSyncComponent} from './components/mongosync/mongo-sync.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    SyncService,
    ErrorService
  ],
  declarations: [
    MongoSyncComponent
  ]
})
export class SyncModule {}
