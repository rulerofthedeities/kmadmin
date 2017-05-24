import {Component, Input} from '@angular/core';
import {WordDetail} from '../../../models/jazyk.model';

@Component({
  selector: 'km-detail-fields-info',
  template: `
    <div *ngIf="detail" class="read">
      <div class="form-group">
        <label 
          for="lan" 
          class="control-label col-xs-3">
          Score:
        </label>
        <div class="col-xs-9">
          {{detail.score}}
        </div>
      </div>
      <div class="form-group">
        <label 
          for="lan" 
          class="control-label col-xs-3">
          Words:
        </label>
        <div class="col-xs-9">
          {{detail.wordCount}}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../edit-word.component.css']
})

export class JazykDetailInfoFieldsComponent {
  @Input() detail: WordDetail;
}
