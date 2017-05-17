import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FilterList, Filter, WordPair, WordDetail} from '../../models/jazyk.model';
import {JazykEditWordPairComponent} from './edit-wordpair.component';
import {JazykDetailForm} from './edit-worddetail.component';
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
          <km-detail-form-nl
            [lan]="'nl-nl'"
            [detailOnly]="true"
            [detail]="detail"
            #edit>
          </km-detail-form-nl>
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
  @ViewChild('edit') editWordDetails: JazykDetailForm;

  constructor(
    private route: ActivatedRoute
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
    this.lan = filterList.filter.lanCode;
  }

  onSelectedWordPair(filterWord: Filter) {
    // Edit selected word in all available languages
    this.editWordPairs.editNewWords(filterWord);
  }

  onSelectedWordDetail(worddetail: WordDetail) {
    this.detail = worddetail;
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
