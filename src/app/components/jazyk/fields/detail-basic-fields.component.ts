import {Component, Input} from '@angular/core';
import {WordDetail} from '../../../models/jazyk.model';

@Component({
  selector: 'km-detail-fields-basic',
  templateUrl: 'detail-basic-fields.component.html',
  styleUrls: ['../edit-word.component.css']
})

export class JazykDetailBasicFieldsComponent {
  @Input() detail: WordDetail;
}
