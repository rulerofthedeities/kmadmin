import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';

import {routes} from './app.routes';

import {AppComponent} from './components/app.component';
import {MenuComponent} from './components/menu.component';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
  ],
  declarations: [
    AppComponent,
    MenuComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
