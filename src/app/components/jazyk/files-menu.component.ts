import {Component} from '@angular/core';

@Component({
  template: `
    <nav class="clearfix">
      <ul class="nav navbar-nav">
        <li routerLinkActive="active">
          <a routerLink="/jazyk/files/images" class="item">Import Images</a>
        </li>
        <li routerLinkActive="active">
          <a routerLink="/jazyk/files/audio" class="item">Import Audio</a>
        </li>
        <li routerLinkActive="active">
          <a routerLink="/jazyk/files/processaudio" class="item">Process Audio</a>
        </li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['../menu.css']
})

export class JazykFilesMenuComponent {

}
