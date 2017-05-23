import {Component, Input, Output, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {Language, Filter, FilterList, WordPair} from '../../../models/jazyk.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'km-filter-word',
  templateUrl: 'edit-filter.component.html',
  styleUrls: ['./edit-filter.css']
})

export class JazykEditFilterComponent implements OnInit, OnDestroy {
  @Input() isFromStart = false;
  @Input() isExact = false;
  @Input() tpe = 'wordpairs';
  @Output() filteredWords = new EventEmitter<FilterList>();
  languages: Language[];
  componentActive = true;
  filter: Filter;
  totalWords = '';

  constructor(
    private jazykService: JazykService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.getLanguagePairs();
    this.filter = {
      word: '',
      lanCode: this.languages[0].code,
      wordTpe: '', // only used for worddetail
      isFromStart: this.isFromStart,
      isExact: this.isExact,
      returnTotal: true
    };
  }

  onFilterChanged() {
    if (this.tpe === 'wordpairs') {
      this.getWordPairList(this.filter);
    } else {
      this.getWordDetailList(this.filter);
    }
  }

  getWordPairList(filter: Filter) {
    this.jazykService
    .fetchFilterWordPairs(filter)
    .takeWhile(() => this.componentActive)
    .subscribe(
      (data) => {
        this.filteredWords.emit({wordpairs: data.wordpairs, filter});
        this.totalWords = data.wordpairs.length + '/' + data.total;
      },
      error => this.errorService.handleError(error)
    );
  }

  getWordDetailList(filter: Filter) {
    this.jazykService
    .fetchFilterWordDetails(filter)
    .takeWhile(() => this.componentActive)
    .subscribe(
      (data) => {
        this.filteredWords.emit({worddetails: data.worddetails, filter});
        this.totalWords = data.worddetails.length + '/' + data.total;
      },
      error => this.errorService.handleError(error)
    );
  }

  getLanguagePairs() {
    this.languages = this.jazykService.getLanguages();
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
