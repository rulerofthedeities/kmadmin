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
import {JazykEditMenuComponent} from './components/jazyk/edit-menu.component';
import {JazykEditWordPairComponent} from './components/jazyk/edit-wordpair.component';
import {JazykEditAltFieldComponent} from './components/jazyk/edit-field-alt.component';
import {JazykEditFilterComponent} from './components/jazyk/edit-filter.component';
import {JaykEditFilterListComponent} from './components/jazyk/edit-filter-list.component';
import {
  JazykDetailFormNlComponent,
  JazykDetailFormFrComponent,
  JazykDetailFormDeComponent,
  JazykDetailFormEnComponent,
  JazykDetailFormCsComponent
} from './components/jazyk/edit-worddetail.component';

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
  entryComponents: [
    JazykDetailFormFrComponent,
    JazykDetailFormNlComponent
  ],
  declarations: [
    CznlImportComponent,
    JazykMenuComponent,
    JazykEditComponent,
    JazykEditMenuComponent,
    JazykEditWordPairComponent,
    JazykEditAltFieldComponent,
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
