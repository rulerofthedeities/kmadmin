import {Component, ViewChild, OnInit, OnDestroy, ComponentFactory, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FilterList, Filter, WordPair, WordDetail} from '../../models/jazyk.model';
import {JazykEditWordPairComponent} from './edit-wordpair.component';
import {JazykDetailForm,
        JazykDetailFormFrComponent,
        JazykDetailFormNlComponent
       } from './edit-worddetail.component';
import 'rxjs/add/operator/takeWhile';

@Component({
  template: `
    <section>
      <div class="row">
        <div class="col-xs-12">
          <km-filter-word
            [tpe]="tpe"
            (filteredWords)="onWordsFiltered($event)">
          </km-filter-word>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3">
          <km-filter-list
            [lan]="lan"
            [wordpairs]="wordpairs"
            [worddetails]="worddetails"
            [tpe]="tpe"
            (selectedWordPair)="onSelectedWordPair($event)"
            (selectedWordDetail)="onSelectedWordDetail($event)"
          ></km-filter-list>
        </div>
        <div class="col-xs-9" *ngIf="tpe==='wordpairs'">
          <km-edit-wordpair #edit>
          </km-edit-wordpair>
        </div>
        <div class="col-xs-9" *ngIf="tpe==='worddetails'">
          <!--
          <km-detail-form-nl
            [lan]="'nl-nl'"
            [detailOnly]="true"
            [detail]="detail"
            #edit>
          </km-detail-form-nl>
          -->
          <ng-template #placeholder></ng-template>
        </div>
      </div>
      <div class="clearfix"></div>
    </section>
  `
})

export class JazykEditComponent implements OnInit, OnDestroy {
  wordpairs: WordPair[] = [];
  worddetails: WordDetail[] = [];
  detail: WordDetail;
  lan: string;
  tpe: string;
  componentActive = true;
  @ViewChild('edit') editWordPairs: JazykEditWordPairComponent;
  // @ViewChild('edit') editWordDetails: JazykDetailForm;
  @ViewChild('placeholder', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef;
  cmpRef: any;

  constructor(
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.route
    .data
    .takeWhile(() => this.componentActive)
    .subscribe(data => this.tpe = data.tpe);
  }

  onWordsFiltered(filterList: FilterList) {
    // Show list of filtered words
    this.wordpairs = filterList.wordpairs;
    this.worddetails = filterList.worddetails;
    if (this.lan !== filterList.filter.lanCode) {
      // Language changed -> load different component
      this.lan = filterList.filter.lanCode;
      this.viewContainerRef.clear();
      const factory = this.componentFactoryResolver.resolveComponentFactory(this.getDetailComponent(this.lan));
      const cmpRef = this.viewContainerRef.createComponent(factory);
      cmpRef.instance['detail'] = this.detail;
      cmpRef.instance['lan'] = this.lan;
      cmpRef.instance['detailOnly'] = true;
      this.cmpRef = cmpRef;
    }
  }

  onSelectedWordPair(filterWord: Filter) {
    // Edit selected word in all available languages
    this.editWordPairs.editNewWords(filterWord);
  }

  onSelectedWordDetail(worddetail: WordDetail) {
    this.detail = worddetail;
    console.log('selected word detail', this.cmpRef);
    if (this.cmpRef) {
      this.cmpRef.instance['detail'] = this.detail;
      this.cmpRef.instance['detailOnly'] = false;
    }
  }

  private getDetailComponent(lan: string): any {
    console.log(lan);
    let comp: any;
    switch (lan) {
      case 'nl-nl': comp = JazykDetailFormNlComponent; break;
      case 'fr-fr': comp = JazykDetailFormFrComponent; break;
      default: comp = JazykDetailForm;
    }

    return comp;
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
