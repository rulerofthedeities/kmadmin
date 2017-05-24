import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {WordDetail} from '../../../models/jazyk.model';
import {JazykDetailForm} from '../worddetail/edit-worddetail.component';

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
    let control: FormControl;
    super.buildForm();

    this.articles = this.config.articles;
    if (this.detail.wordTpe === 'noun') {
      control = new FormControl(this.detail.article, Validators.required);
      this.detailForm.addControl('article', control);
      control = new FormControl(this.detail.diminutive);
      this.detailForm.addControl('diminutive', control);
      control = new FormControl(this.detail.plural);
      this.detailForm.addControl('plural', control);
    }
  }

  postProcessFormData(formData: any): WordDetail {
    console.log('post processing nl');
    const newData: WordDetail = super.copyDetail(formData);
    this.addNewField(formData, newData, 'article');
    this.addNewField(formData, newData, 'diminutive');
    this.addNewField(formData, newData, 'plural');

    return newData;
  }
}
