import {Component} from '@angular/core';

@Component({
  template: `
    <nav class="clearfix">
      <ul class="nav navbar-nav">
        <li routerLinkActive="active">
          <a routerLink="/jazyk/import" class="item">Import</a>
        </li>
        <li routerLinkActive="active">
          <a routerLink="/jazyk/edit" class="item">Edit</a>
        </li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['../menu.css']
})

export class JazykMenuComponent {

}
