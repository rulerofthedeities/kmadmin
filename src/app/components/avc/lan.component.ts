import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'km-lans',
  template: `
    <nav class="clearfix">
      <ul class="nav navbar-nav">
        <li routerLinkActive="active">
          <a routerLink="en{{lan==='en' ? '' : subPath}}" class="item">EN</a>
        </li>
        <li routerLinkActive="active">
          <a routerLink="nl{{lan==='nl' ? '' : subPath}}" class="item">NL</a>
        </li>
        <li routerLinkActive="active">
          <a routerLink="fr{{lan==='fr' ? '' : subPath}}" class="item">FR</a>
        </li>
        <li routerLinkActive="active">
          <a routerLink="de{{lan==='de' ? '' : subPath}}" class="item">DE</a>
        </li>
      </ul>
    </nav>
  `,
  styleUrls: ['../menu.css']
})

export class LanComponent implements OnInit, OnDestroy {
  componentActive = true;
  subPath = '';
  lan = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Check for route changes lan / city changes
    this.router.events
    .takeWhile(() => this.componentActive)
    .filter(event => event instanceof NavigationEnd)
    .subscribe(event => {

      this.route.root.children.forEach(route => {
        const path = this.router.url.split('/');
        if (path.length === 5) {
          // CITY
          if (path[4]) {
            this.subPath = '/' + path[4];
            this.lan = path[3];
          } else {
            this.subPath = '';
          }
        } else if (path.length === 6) {
          // ITEM
          if (path[5]) {
            this.subPath = '/' + path[4] + '/' + path[5];
            this.lan = path[3];
          } else {
            this.subPath = '';
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
