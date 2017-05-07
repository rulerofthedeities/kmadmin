import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'km-main-menu',
  template: `
    <nav class="clearfix">
      <ul class="nav navbar-nav">
        <li routerLinkActive="active">
          <a routerLink="mongosync" class="item">MongoSync</a>
        </li>
        <li routerLinkActive="active">
          <a routerLink="jazyk" class="item">Jazyk</a>
        </li>
        <li routerLinkActive="active">
          <a routerLink="avc" class="item">Cities</a>
        </li>
      </ul>
    </nav>
  `,
  styleUrls: ['menu.css']
})

export class MenuComponent {
  constructor (
    private router: Router
  ) {}

}
