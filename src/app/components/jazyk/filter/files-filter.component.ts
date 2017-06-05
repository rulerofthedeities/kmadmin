import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FilterFiles} from '../../../models/jazyk.model';

@Component({
  selector: 'km-filter-files',
  templateUrl: 'files-filter.component.html'
})

export class JazykFilesFilterComponent implements OnInit {
  @Input() tpe: string;
  @Input() lan: string;
  @Input() word: string;
  @Input() showLan = false;
  @Output() selectedFilter = new EventEmitter<FilterFiles>();
  isFromStart = false;
  isExact = false;
  filter: FilterFiles;
  regions: string[];

  ngOnInit() {
    this.regions = ['any', 'cs', 'de', 'fr', 'nl', 'gb', 'us'];
    this.filter = {
      app: 'jazyk',
      tpe: this.tpe,
      word: this.word,
      lanCode: this.lan,
      isFromStart: this.isFromStart,
      isExact: this.isExact,
      returnTotal: true
    };
    if (this.word) {
      this.selectedFilter.emit(this.filter);
    }
  }

  onFilterChanged() {
    this.selectedFilter.emit(this.filter);
  }

}
