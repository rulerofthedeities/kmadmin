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

  setDirty() {
    // checkbox change doesn't set form as dirty
    this.detailForm.markAsDirty();
  }

  buildForm() {
    super.buildForm();
    this.articles = this.config.articles;
    // PRE-PROCESS FORM DATA
    // set article field
    const articleControls: FormControl[] = [],
          selectedArticles = this.detail.article ? this.detail.article.split(';') : [];
    this.articles.forEach(article => {
      articleControls.push(new FormControl(
        selectedArticles.filter(selArticle => selArticle === article).length > 0));
    });

    const control = new FormControl(new FormArray(articleControls), Validators.minLength(1));
    this.detailForm.addControl('article', control);
  }

  updateDetail(formdetail: any) {
    const worddetail = this.postProcessFormData(formdetail);
    super.updateWordDetail(worddetail);
  }

  addDetail(formdetail: any) {
    const worddetail = this.postProcessFormData(formdetail);
    super.addWordDetail(worddetail);
  }

  newDetail() {
    this.detail = null;
    this.detailExists = false;
    this.buildForm();
  }

  postProcessFormData(data: any): WordDetail {
    const newData: WordDetail = super.copyDetail(data);
    super.processArticle(data, newData, this.articles);

    return newData;
  }
}
