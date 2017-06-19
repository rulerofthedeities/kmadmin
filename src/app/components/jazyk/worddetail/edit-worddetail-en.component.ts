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
  regions: string[];
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
    this.regions = this.config.regions;
    if (this.regions[0] !== this.detail.lan) {
      this.regions.unshift(this.detail.lan);
    }
    this.addControls();
  }

  addControls() {
    let control: FormControl;
    control = new FormControl(this.detail.region, Validators.required);
    this.detailForm.addControl('region', control);
    const wordTpe = this.detailForm.value['wordTpe'];
    switch (wordTpe) {
      case 'noun':
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
    console.log('post processing en');
    const newData: WordDetail = super.copyDetail(formData);
    this.addNewField(formData, newData, 'region');
    this.addNewField(formData, newData, 'plural');
    this.addNewArray(formData, newData, 'conjugation', 6);
    this.addNewField(formData, newData, 'isPlural');

    return newData;
  }
}
