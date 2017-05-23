import {Component, Input, Output, EventEmitter} from '@angular/core';
import {WordPair, WordDetail, Filter} from '../../../models/jazyk.model';

@Component({
  selector: 'km-filter-list',
  templateUrl: 'edit-filter-list.component.html',
  styleUrls: ['./edit-filter.css']
})

export class JaykEditFilterListComponent {
  @Input() wordpairs: WordPair[];
  @Input() worddetails: WordDetail[];
  @Input() lan: string;
  @Input() tpe: string;
  @Output() selectedWordPair = new EventEmitter<Filter>();
  @Output() selectedWordDetail = new EventEmitter<WordDetail>();

  getWordPair(wordpair: WordPair): string {
    const lan = this.lan.slice(0, 2);
    let word = '';
    if (wordpair && wordpair[lan]) {
      word = wordpair[lan].word;
    }
    return word;
  }

  getWordDetail(worddetail: WordDetail): string {
    let word = '';
    if (worddetail) {
      word = worddetail.word;
    }
    return word;
  }

  selectListWordPair(i: number) {
    const lan = this.lan.slice(0, 2);
    const wordListFilter: Filter = {
      word: this.wordpairs[i][lan].word,
      lanCode: this.lan,
      wordTpe: this.wordpairs[i].wordTpe
    };
    this.selectedWordPair.emit(wordListFilter);
  }

  selectListWordDetail(i: number) {
    this.selectedWordDetail.emit(this.worddetails[i]);
  }
}
