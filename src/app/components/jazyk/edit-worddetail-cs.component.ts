import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../services/jazyk.service';
import {ErrorService} from '../../services/error.service';
import {JazykDetailForm} from './edit-worddetail.component';
import {WordDetail} from '../../models/jazyk.model';

@Component({
  selector: 'km-detail-form-cs',
  template: `
    DETAIL CS
    {{wordTpe}}
    detail:<pre>{{detail|json}}</pre>
  `,
  styleUrls: ['edit-word.component.css']
})

export class JazykDetailFormCsComponent extends JazykDetailForm {
  constructor (
    formBuilder: FormBuilder,
    errorService: ErrorService,
    jazykService: JazykService
  ) {
    super(formBuilder, errorService, jazykService);
  }
}