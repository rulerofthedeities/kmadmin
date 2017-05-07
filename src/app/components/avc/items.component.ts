import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AvcService} from '../../services/avc.service';
import {ErrorService} from '../../services/error.service';
import {Item} from '../../models/avc.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  template: `
    <div *ngIf="items">
      <strong>Items for {{item}}</strong>
      <div *ngFor="let item of items" class="item" (click)="onSelectItem(item.alias.en)">
        <img src="/assets/img/{{item.isTopAttraction ? 'top' : 'article'}}.png" *ngIf="item.isPublished[lan]">
        <span [ngClass]="{notpublished:!item.isPublished[lan]}">{{item.title.en}}</span>
      </div>
    </div>
  `,
  styles: [`
    .item, .back {
      cursor: pointer;
    }
    .item:hover {
      text-decoration: underline;
    }
    .notpublished {
      color:#666;
      margin-left:12px;
    }
  `]
})

export class ItemsComponent implements OnInit, OnDestroy {
  componentActive = true;
  city: string;
  lan: string;
  items: Item[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private avcService: AvcService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.activatedRoute.params
    .takeWhile(() => this.componentActive)
    .subscribe(
      params => {
        const lan = params['lan'];
        const cityAlias = params['city'];
        this.lan = lan;
        this.city = cityAlias;
        this.fetchItems(cityAlias, lan);
      }
    );
  }

  onSelectItem(itemAlias: string) {
    this.router.navigate([itemAlias], {relativeTo: this.activatedRoute});
  }

  fetchItems(cityAlias: string, lan: string) {
    this.avcService
    .fetchItemList(cityAlias, lan)
    .takeWhile(() => this.componentActive)
    .subscribe(
      items => {
        this.items = items;
      },
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
