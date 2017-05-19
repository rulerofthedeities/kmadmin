import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../services/jazyk.service';
import {ErrorService} from '../../services/error.service';
import {JazykDetailForm} from './edit-worddetail.component';
import {WordDetail} from '../../models/jazyk.model';

@Component({
  selector: 'km-detail-form-nl',
  templateUrl: 'edit-worddetail-nl.component.html',
  styleUrls: ['edit-word.component.css']
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
    // PRE-PROCESS FORM DATA
    // set article field
    this.articles = this.config.articles;
    const articleControls: FormControl[] = [],
          articleFld = this.detail.article,
          selectedArticles = articleFld ? articleFld.split(';') : [];
    this.articles.forEach(article => {
      articleControls.push(new FormControl(
        selectedArticles.filter(selArticle => selArticle === article).length > 0));
    });

    const control = new FormControl(new FormArray(articleControls), Validators.minLength(1));
    this.detailForm.addControl('article', control);
  }

  postProcessFormData(formData: any): WordDetail {
    console.log('post processing nl');
    const newData: WordDetail = super.copyDetail(formData);
    super.processArticle(formData, newData, this.articles);

    return newData;
  }
}
