import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {WordDetail, Case} from '../../../models/jazyk.model';
import {JazykDetailForm} from '../worddetail/edit-worddetail.component';

@Component({
  selector: 'km-detail-form-de',
  templateUrl: 'edit-worddetail-de.component.html',
  styleUrls: ['../edit-word.component.css']
})

export class JazykDetailFormDeComponent extends JazykDetailForm implements OnInit {
  genera: string[];
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
    super.buildForm();
    this.addControls();
  }

  addControls() {
    let control: FormControl;
    this.genera = this.config.genera;
    this.cases = this.config.cases;
    switch (this.detail.wordTpe) {
      case 'noun':
        this.detail.case = this.detail.case ?  this.detail.case : '1';
        control = new FormControl(this.detail.genus, Validators.required);
        this.detailForm.addControl('genus', control);
        control = new FormControl(this.detail.diminutive);
        this.detailForm.addControl('diminutive', control);
        control = new FormControl(this.detail.plural);
        this.detailForm.addControl('plural', control);
        control = new FormControl(this.detail.case);
        this.detailForm.addControl('case', control);
        control = new FormControl(this.detail.isDiminutive);
        this.detailForm.addControl('isDiminutive', control);
        control = new FormControl(this.detail.isPlural);
        this.detailForm.addControl('isPlural', control);
        break;
      case 'pronoun':
        this.detail.case = this.detail.case ?  this.detail.case : '1';
        control = new FormControl(this.detail.case);
        this.detailForm.addControl('case', control);
        break;
      case 'preposition':
        control = new FormControl(this.detail.followingCase);
        this.detailForm.addControl('followingCase', control);
        break;
      case 'adjective':
        control = new FormControl(this.detail.comparative);
        this.detailForm.addControl('comparative', control);
        control = new FormControl(this.detail.superlative);
        this.detailForm.addControl('superlative', control);
        control = new FormControl(this.detail.isComparative);
        this.detailForm.addControl('isComparative', control);
        control = new FormControl(this.detail.isSuperlative);
        this.detailForm.addControl('isSuperlative', control);
        break;
      case 'verb':
        this.cases.unshift({code: 'none', value: ''});
        let conj;
        for (let i = 0; i < 6; i++) {
          conj = this.detail.conjugation ? this.detail.conjugation[i] : '';
          control = new FormControl(conj);
          this.detailForm.addControl('conjugation' + i, control);
        }
        control = new FormControl(this.detail.followingCase);
        this.detailForm.addControl('followingCase', control);
        break;
    }
  }

  postProcessFormData(formData: any): WordDetail {
    console.log('post processing de');
    const newData: WordDetail = super.copyDetail(formData);
    this.addNewField(formData, newData, 'genus');
    this.addNewField(formData, newData, 'diminutive');
    this.addNewField(formData, newData, 'plural');
    this.addNewField(formData, newData, 'comparative');
    this.addNewField(formData, newData, 'superlative');
    this.addNewArray(formData, newData, 'conjugation', 6);
    this.addNewField(formData, newData, 'followingCase');
    this.addNewField(formData, newData, 'case');
    this.addNewField(formData, newData, 'isDiminutive');
    this.addNewField(formData, newData, 'isPlural');
    this.addNewField(formData, newData, 'isComparative');
    this.addNewField(formData, newData, 'isSuperlative');

    return newData;
  }
}

