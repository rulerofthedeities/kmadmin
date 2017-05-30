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
import {JazykEditWordPairComponent} from './components/jazyk/wordpair/edit-wordpair.component';
import {JazykEditWordPairMultipleComponent} from './components/jazyk/wordpair/edit-wordpair-multiple.component';
import {JazykEditFilterComponent} from './components/jazyk/filter/edit-filter.component';
import {JaykEditFilterListComponent} from './components/jazyk/filter/edit-filter-list.component';
import {JazykDetailFormNlComponent} from './components/jazyk/worddetail/edit-worddetail-nl.component';
import {JazykDetailFormFrComponent} from './components/jazyk/worddetail/edit-worddetail-fr.component';
import {JazykDetailFormDeComponent} from './components/jazyk/worddetail/edit-worddetail-de.component';
import {JazykDetailFormEnComponent} from './components/jazyk/worddetail/edit-worddetail-en.component';
import {JazykDetailFormCsComponent} from './components/jazyk/worddetail/edit-worddetail-cs.component';
import {JazykEditAltFieldComponent} from './components/jazyk/fields/edit-field-alt.component';
import {JazykDetailInfoFieldsComponent} from './components/jazyk/fields/detail-info-fields.component';
import {JazykDetailBasicFieldsComponent} from './components/jazyk/fields/detail-basic-fields.component';
import {JazykFilesMenuComponent} from './components/jazyk/files-menu.component';
import {JazykFilesComponent} from './components/jazyk/files.component';
import {JazykFilesFilterComponent} from './components/jazyk/filter/files-filter.component';
import {JazykImageFieldComponent} from './components/jazyk/fields/image-filter-field.component';
import {JazykImageListComponent} from './components/jazyk/fields/image-list-field.component';

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
    JazykDetailFormNlComponent,
    JazykDetailFormDeComponent,
    JazykDetailFormEnComponent,
    JazykDetailFormCsComponent
  ],
  declarations: [
    CznlImportComponent,
    JazykMenuComponent,
    JazykEditComponent,
    JazykEditMenuComponent,
    JazykEditWordPairComponent,
    JazykEditWordPairMultipleComponent,
    JazykEditAltFieldComponent,
    JazykEditFilterComponent,
    JaykEditFilterListComponent,
    JazykDetailFormNlComponent,
    JazykDetailFormFrComponent,
    JazykDetailFormDeComponent,
    JazykDetailFormEnComponent,
    JazykDetailFormCsComponent,
    JazykDetailInfoFieldsComponent,
    JazykDetailBasicFieldsComponent,
    JazykFilesMenuComponent,
    JazykFilesComponent,
    JazykFilesFilterComponent,
    JazykImageFieldComponent,
    JazykImageListComponent
  ]
})
export class JazykModule {}
