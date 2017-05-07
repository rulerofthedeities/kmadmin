import {Component} from '@angular/core';

@Component({
  template: `
    <nav class="clearfix">
      <ul class="nav navbar-nav">
        <li routerLinkActive="active">
          <a routerLink="/avc/cities" class="item">Cities</a>
        </li>
        <li routerLinkActive="active">
          <a routerLink="/avc/items" class="item">Items</a>
        </li>
        <li routerLinkActive="active">
          <a routerLink="/avc/photos" class="item">Photos</a>
        </li>
      </ul>
    </nav>
    <km-lans></km-lans>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['../menu.css']
})

export class AvcMenuComponent {

}
