import {Component, ViewChild} from '@angular/core';
import {FilterList, Filter, WordPair} from '../../models/jazyk.model';
import {JazykEditWordComponent} from './edit-word.component';

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
            (selectedWord)="onSelectedWord($event)"
          ></km-filter-list>
        </div>
        <div class="col-xs-9">
          <km-edit-word
          [wordpairs]="wordpairs" #edit>
          </km-edit-word>
        </div>
      </div>
      <div class="clearfix"></div>
    </section>
  `
})

export class JazykEditComponent {
  wordpairs: WordPair[];
  lan: string;
  @ViewChild('edit') editWords: JazykEditWordComponent;

  onWordsFiltered(filterList: FilterList) {
    // Show list of filtered words
    this.wordpairs = filterList.wordpairs;
    this.lan = filterList.filter.lanCode;
  }

  onSelectedWord(filterWord: Filter) {
    // Edit selected word in all available languages
    console.log('filterword', filterWord);
    this.editWords.editNewWords(filterWord);
  }
}
