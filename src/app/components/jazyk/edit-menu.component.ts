import {Component} from '@angular/core';

@Component({
  template: `
    <nav class="clearfix">
      <ul class="nav navbar-nav">
        <li routerLinkActive="active">
          <a routerLink="/jazyk/edit/wordpairs" class="item">Wordpairs</a>
        </li>
        <li routerLinkActive="active">
          <a routerLink="/jazyk/edit/worddetails" class="item">Worddetails</a>
        </li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['../menu.css']
})

export class JazykEditMenuComponent {

}
