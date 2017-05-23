import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {WordDetail} from '../../../models/jazyk.model';
import {JazykDetailForm} from '../worddetail/edit-worddetail.component';

@Component({
  selector: 'km-detail-form-en',
  templateUrl: 'edit-worddetail-en.component.html',
  styleUrls: ['../edit-word.component.css']
})

export class JazykDetailFormEnComponent extends JazykDetailForm implements OnInit {
  constructor (
    formBuilder: FormBuilder,
    errorService: ErrorService,
    jazykService: JazykService
  ) {
    super(formBuilder, errorService, jazykService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  buildForm() {
    super.buildForm();
  }

  postProcessFormData(formData: any): WordDetail {
    console.log('post processing en');
    const newData: WordDetail = super.copyDetail(formData);

    return newData;
  }
}
