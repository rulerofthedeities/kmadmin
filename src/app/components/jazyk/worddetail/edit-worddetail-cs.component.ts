import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {WordDetail, Case} from '../../../models/jazyk.model';
import {JazykDetailForm} from '../worddetail/edit-worddetail.component';

@Component({
  selector: 'km-detail-form-cs',
  templateUrl: 'edit-worddetail-cs.component.html',
  styleUrls: ['../edit-word.component.css']
})

export class JazykDetailFormCsComponent extends JazykDetailForm implements OnInit {
  genera: string[];
  aspects: string[];
  cases: Case[];

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
    let control: FormControl;
    super.buildForm();

    this.genera = this.config.genera;
    this.aspects = this.config.aspects;
    this.cases = this.config.cases;
    this.cases.unshift({code: 'none', value: ''});

    if (this.detail.wordTpe === 'noun') {
      control = new FormControl(this.detail.genus, Validators.required);
      this.detailForm.addControl('genus', control);
      control = new FormControl(this.detail.diminutive);
      this.detailForm.addControl('diminutive', control);
      control = new FormControl(this.detail.plural);
      this.detailForm.addControl('plural', control);
    }
    if (this.detail.wordTpe === 'adjective') {
      control = new FormControl(this.detail.comparative);
      this.detailForm.addControl('comparative', control);
      control = new FormControl(this.detail.superlative);
      this.detailForm.addControl('superlative', control);
    }
    if (this.detail.wordTpe === 'verb') {
      let conj;
      for (let i = 0; i < 6; i++) {
        conj = this.detail.conjugation ? this.detail.conjugation[i] : '';
        control = new FormControl(conj);
        this.detailForm.addControl('conjugation' + i, control);
      }
      control = new FormControl(this.detail.aspect, Validators.required);
      this.detailForm.addControl('aspect', control);
      control = new FormControl(this.detail.aspectPair);
      this.detailForm.addControl('aspectPair', control);
      control = new FormControl(this.detail.followingCase);
      this.detailForm.addControl('followingCase', control);
    }
    // this.addTagControl();
  }

  postProcessFormData(formData: any): WordDetail {
    console.log('post processing cs');
    const newData: WordDetail = super.copyDetail(formData);
    this.addNewField(formData, newData, 'genus');
    this.addNewField(formData, newData, 'diminutive');
    this.addNewField(formData, newData, 'plural');
    this.addNewField(formData, newData, 'comparative');
    this.addNewField(formData, newData, 'superlative');
    this.addNewArray(formData, newData, 'conjugation', 6);
    // this.addNewArray(formData, newData, 'tags', 1);
    this.addNewField(formData, newData, 'aspect');
    this.addNewField(formData, newData, 'aspectPair');
    this.addNewField(formData, newData, 'followingCase');

    return newData;
  }
}
