import {Component} from '@angular/core';

@Component({
  selector: 'km-admin',
  template: `
  <div class="container">
    <km-main-menu></km-main-menu>
    <router-outlet></router-outlet>
  </div>
  `
})

export class AppComponent {}
