import {Component} from '@angular/core';
import {FilterList, WordPair} from '../../models/jazyk.model';

@Component({
  template: `
    <section>
      <div class="row">
        <div class="col-xs-12">
          <km-filter-word
            (filteredWords)="onWordsFiltered($event)">
          </km-filter-word>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3">
          <km-filter-list
            [lan]="lan"
            [wordpairs]="wordpairs"
          ></km-filter-list>
        </div>
        <div class="col-xs-9">
          <km-edit-word
            [wordpairs]="wordpairs"
          ></km-edit-word>
        </div>
      </div>
      <div class="clearfix"></div>
    </section>


  `
})

export class JazykEditComponent {
  wordpairs: WordPair[];
  lan: string;

  onWordsFiltered(filterList: FilterList) {
    this.wordpairs = filterList.wordpairs;
    this.lan = filterList.filter.lanCode;
  }


    // TODO: First get all wordpairs for the word in the language from the filter
    // TODO: Next get the worddetails for all these wordpairs
}
