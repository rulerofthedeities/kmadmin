import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../services/jazyk.service';
import {ErrorService} from '../../services/error.service';
import {WordDetail, LanConfig} from '../../models/jazyk.model';
import {Observable, Subscription} from 'rxjs/Rx';

export abstract class JazykDetailForm implements OnChanges, OnInit {
  @Input() wordTpe: string;
  @Input() lan: string;
  @Input() detail: WordDetail;
  componentActive = true;
  detailForm: FormGroup;
  detailExists = false;
  config: LanConfig;

  constructor(
    public formBuilder: FormBuilder,
    private errorService: ErrorService,
    private jazykService: JazykService
  ) {}

  ngOnInit() {
    console.log('init main', this.lan);
    this.getConfig(this.lan);
  }

  ngOnChanges() {
    this.detailExists = this.detail ? true : false;
    if (this.detail) {
      this.buildForm(this.detail);
    }
  }

  add() {
    const formData = this.postProcessFormData(this.detailForm.value);
    console.log('add detail form in db', this.lan, formData);
  }

  update() {
    const formData = this.postProcessFormData(this.detailForm.value);
    console.log('update detail form in db', this.lan, formData);
  }

  postProcessFormData(data: any): any {
    return data;
  }

  buildForm(detail: WordDetail) {
    detail = detail ? detail : this.getNewDetail();
    this.detailForm = this.formBuilder.group({
      '_id': [detail._id],
      'docTpe': [detail.docTpe],
      'wordTpe': [detail._id],
      'lan': [detail.lan],
      'word': [detail.word],
      'article': [detail.article]
    });
  }

  getNewDetail(): WordDetail {
    const detail: WordDetail = {
      _id: '',
      article: 'de;het',
      lan: this.lan.slice(0, 2),
      word: '',
      docTpe: 'details',
      wordTpe: this.wordTpe
    };
    return detail;
  }

  getConfig(lanCode: string) {
    console.log('getting config', lanCode);
    this.jazykService
    .fetchLanConfig(lanCode)
    .takeWhile(() => this.componentActive)
    .subscribe(
      config => {
        this.config = config;
        console.log(config);
        this.buildForm(this.detail);
      },
      error => this.errorService.handleError(error)
    );
  }
}

@Component({
  selector: 'km-detail-form-nl',
  templateUrl: 'edit-word-detail-nl.component.html',
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
    console.log('init nl', this);
    super.ngOnInit();
  }

  buildForm(detail: WordDetail) {
    detail = detail ? detail : this.getNewDetail();
    this.articles = this.config.articles;
    // PRE-PROCESS FORM DATA
    // set article field
    const articleControls: FormControl[] = [],
          selectedArticles = detail.article.split(';');
    this.articles.forEach(article => {
      articleControls.push(new FormControl(
        selectedArticles.filter(selArticle => selArticle === article).length > 0));
    });

    this.detailForm = this.formBuilder.group({
      '_id': [detail._id],
      'docTpe': [detail.docTpe],
      'wordTpe': [detail._id],
      'lan': [detail.lan],
      'word': [detail.word],
      'article': new FormArray(articleControls)
    });
  }

  postProcessFormData(data: any): any {
    // Articles - transform array of bools into string of articles
    const articleArr = [];
    for (let i = 0; i < this.articles.length; i++) {
      if (data.article[i]) {
        articleArr.push(this.articles[i]);
      }
    }
    data.article = articleArr.join(';');

    return data;
  }
}


@Component({
  selector: 'km-detail-form-fr',
  templateUrl: 'edit-word-detail-fr.component.html',
  styleUrls: ['edit-word.component.css']
})

export class JazykDetailFormFrComponent extends JazykDetailForm {
  genera: string[];
  constructor (
    formBuilder: FormBuilder,
    errorService: ErrorService,
    jazykService: JazykService
  ) {
    super(formBuilder, errorService, jazykService);
  }

  buildForm(detail: WordDetail) {
    detail = detail ? detail : this.getNewDetail();
    this.genera = this.config.genera;

    this.detailForm = this.formBuilder.group({
      '_id': [detail._id],
      'docTpe': [detail.docTpe],
      'wordTpe': [detail._id],
      'lan': [detail.lan],
      'word': [detail.word],
      'genus': [detail.genus]
    });
  }
}

@Component({
  selector: 'km-detail-form-de',
  template: `
    DETAIL DE
    {{wordTpe}}
    detail:<pre>{{detail|json}}</pre>
  `,
  styleUrls: ['edit-word.component.css']
})

export class JazykDetailFormDeComponent extends JazykDetailForm {
  constructor (
    formBuilder: FormBuilder,
    errorService: ErrorService,
    jazykService: JazykService
  ) {
    super(formBuilder, errorService, jazykService);
  }
}

@Component({
  selector: 'km-detail-form-en',
  template: `
    DETAIL EN
    {{wordTpe}}
    detail:<pre>{{detail|json}}</pre>
  `,
  styleUrls: ['edit-word.component.css']
})

export class JazykDetailFormEnComponent extends JazykDetailForm {
  constructor (
    formBuilder: FormBuilder,
    errorService: ErrorService,
    jazykService: JazykService
  ) {
    super(formBuilder, errorService, jazykService);
  }
}

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
