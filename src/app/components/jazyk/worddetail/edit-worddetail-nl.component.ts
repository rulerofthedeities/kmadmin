import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {WordDetail} from '../../../models/jazyk.model';
import {JazykDetailForm} from './edit-worddetail.component';

@Component({
  selector: 'km-detail-form-nl',
  templateUrl: 'edit-worddetail-nl.component.html',
  styleUrls: ['../edit-word.component.css']
})

export class JazykDetailFormNlComponent extends JazykDetailForm implements OnInit {
  checkboxArray: FormArray;
  articles: string[];

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
    this.articles = this.config.articles;
    switch (this.detail.wordTpe) {
      case 'noun':
        control = new FormControl(this.detail.article, Validators.required);
        this.detailForm.addControl('article', control);
        control = new FormControl(this.detail.diminutive);
        this.detailForm.addControl('diminutive', control);
        control = new FormControl(this.detail.plural);
        this.detailForm.addControl('plural', control);
        control = new FormControl(this.detail.isDiminutive);
        this.detailForm.addControl('isDiminutive', control);
        control = new FormControl(this.detail.isPlural);
        this.detailForm.addControl('isPlural', control);
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
    console.log('post processing nl');
    const newData: WordDetail = super.copyDetail(formData);
    this.addNewField(formData, newData, 'article');
    this.addNewField(formData, newData, 'diminutive');
    this.addNewField(formData, newData, 'plural');
    this.addNewField(formData, newData, 'comparative');
    this.addNewField(formData, newData, 'superlative');
    this.addNewArray(formData, newData, 'conjugation', 6);
    this.addNewField(formData, newData, 'isDiminutive');
    this.addNewField(formData, newData, 'isPlural');
    this.addNewField(formData, newData, 'isComparative');
    this.addNewField(formData, newData, 'isSuperlative');

    return newData;
  }
}
