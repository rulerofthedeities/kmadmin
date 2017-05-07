import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TooltipModule} from 'ngx-tooltip';

import {routes} from './jazyk.routes';

import {ErrorService} from './services/error.service';
import {JazykService} from './services/jazyk.service';

import {CznlImportComponent} from './components/jazyk/cznl-import.component';
import {JazykMenuComponent} from './components/jazyk/menu.component';
import {JazykEditComponent} from './components/jazyk/edit.component';
import {JazykEditWordComponent} from './components/jazyk/edit-word.component';
import {JazykEditFilterComponent} from './components/jazyk/edit-filter.component';
import {JaykEditFilterListComponent} from './components/jazyk/edit-filter-list.component';
import {
  JazykDetailFormNlComponent,
  JazykDetailFormFrComponent,
  JazykDetailFormDeComponent,
  JazykDetailFormEnComponent,
  JazykDetailFormCsComponent
} from './components/jazyk/edit-word-detail.component';

@NgModule({
  imports: [
    SharedModule,
    HttpModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TooltipModule
  ],
  providers: [
    ErrorService,
    JazykService
  ],
  declarations: [
    CznlImportComponent,
    JazykMenuComponent,
    JazykEditComponent,
    JazykEditWordComponent,
    JazykEditFilterComponent,
    JaykEditFilterListComponent,
    JazykDetailFormNlComponent,
    JazykDetailFormFrComponent,
    JazykDetailFormDeComponent,
    JazykDetailFormEnComponent,
    JazykDetailFormCsComponent
  ]
})
export class JazykModule {}
