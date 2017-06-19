import {Component, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {WordPair, WordDetail, Filter} from '../../../models/jazyk.model';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {Observable} from 'rxjs/Observable';

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
  private componentActive = true;

  constructor(
    private errorService: ErrorService,
    private jazykService: JazykService
  ) {}

  getWordPair(wordpair: WordPair): string {
    const lan = this.lan;
    let word = '';
    if (wordpair && wordpair[lan]) {
      word = wordpair[lan].word;
    }
    return word;
  }

  getWordTpe(i: number) {
    const detailId = this.wordpairs[i][this.lan].detailId;

    if (detailId) {
      this.jazykService
      .getWordTpe(detailId)
      .takeWhile(() => this.componentActive)
      .subscribe(
        data => {
          this.wordpairs[i][this.lan].wordTpe = data.wordTpe;
        },
        error => this.errorService.handleError(error)
      );
    }
  }

  getWordDetail(worddetail: WordDetail): string {
    let word = '';
    if (worddetail) {
      word = worddetail.word;
    }
    return word;
  }

  selectListWordPair(i: number) {
    const wordListFilter: Filter = {
      word: this.wordpairs[i][this.lan].word,
      lanCode: this.lan
    };
    this.selectedWordPair.emit(wordListFilter);
  }

  selectListWordDetail(i: number) {
    this.selectedWordDetail.emit(this.worddetails[i]);
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
