import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {WordDetail} from '../../../models/jazyk.model';
import {JazykDetailForm} from './edit-worddetail.component';

@Component({
  selector: 'km-detail-form-fr',
  templateUrl: 'edit-worddetail-fr.component.html',
  styleUrls: ['../edit-word.component.css']
})

export class JazykDetailFormFrComponent extends JazykDetailForm implements OnInit {
  genera: string[];
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
    this.addControls();
  }

  addControls() {
    let control: FormControl;
    this.genera = this.config.genera;
    switch (this.detail.wordTpe) {
      case 'noun':
        control = new FormControl(this.detail.genus, Validators.required);
        this.detailForm.addControl('genus', control);
        control = new FormControl(this.detail.plural);
        this.detailForm.addControl('plural', control);
        control = new FormControl(this.detail.isPlural);
        this.detailForm.addControl('isPlural', control);
        break;
    case 'verb':
      let conj;
      for (let i = 0; i < 6; i++) {
        conj = this.detail.conjugation ? this.detail.conjugation[i] : '';
        control = new FormControl(conj);
        this.detailForm.addControl('conjugation' + i, control);
      }
      break;
    }
  }

  postProcessFormData(formData: any): WordDetail {
    console.log('post processing fr');
    const newData: WordDetail = super.copyDetail(formData);
    this.addNewField(formData, newData, 'genus');
    this.addNewField(formData, newData, 'plural');
    this.addNewArray(formData, newData, 'conjugation', 6);
    this.addNewField(formData, newData, 'isPlural');

    return newData;
  }
}
