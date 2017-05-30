import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FilterFiles} from '../../../models/jazyk.model';

@Component({
  selector: 'km-filter-files',
  templateUrl: 'files-filter.component.html'
})

export class JazykFilesFilterComponent implements OnInit {
  @Input() tpe;
  @Output() selectedFilter = new EventEmitter<FilterFiles>();
  isFromStart = false;
  isExact = false;
  filter: FilterFiles;

  ngOnInit() {
    this.filter = {
      app: 'jazyk',
      tpe: this.tpe,
      word: '',
      isFromStart: this.isFromStart,
      isExact: this.isExact,
      returnTotal: true
    };
  }

  onFilterChanged() {
    this.selectedFilter.emit(this.filter);
  }

}
