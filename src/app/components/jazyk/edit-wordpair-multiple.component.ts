import {Component, Input, Output, EventEmitter} from '@angular/core';
import {WordDetail} from '../../models/jazyk.model';

@Component({
  selector: 'km-multiple-details',
  template: `
    <h1>MULTIPLE DETAILS</h1>
    <ul class="list-unstyled">
      <li *ngFor="let detail of details; let i=index">
        <pre>
          {{detail|json}}
          <div class="btn btn-success" (click)="onSelectDetail(i)">
          Select
          </div>
        </pre>
      </li>
    </ul>
  `
})

export class JazykEditWordPairMultipleComponent {
  @Input() details: WordDetail[];
  @Output() selectedDetail = new EventEmitter<WordDetail>();

  onSelectDetail(i) {
    this.selectedDetail.emit(this.details[i]);
  }
}
