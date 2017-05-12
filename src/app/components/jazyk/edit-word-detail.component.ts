import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../services/jazyk.service';
import {ErrorService} from '../../services/error.service';
import {WordDetail, LanConfig} from '../../models/jazyk.model';
import 'rxjs/add/operator/takeWhile';

export abstract class JazykDetailForm implements OnChanges, OnInit {
  @Input() wordTpe: string;
  @Input() lan: string;
  @Input() word: string;
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
    this.getConfig(this.lan);
  }

  ngOnChanges() {
    let detail: WordDetail;
    this.detailExists = this.detail ? true : false;
    if (this.config) {
      if (this.detail) {
        this.buildForm(this.detail);
      } else {
        detail = this.getNewDetail();
        this.buildForm(detail);
      }
    } else {
      this.getConfig(this.lan);
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
      'wordTpe': [detail.wordTpe],
      'lan': [detail.lan],
      'word': [detail.word]
    });
  }

  /* 
  // Doesn't work with conditional validators
  updateForm() {
    console.log('updating', this.lan, this.wordTpe, this.word);
    this.detailForm.patchValue({wordTpe: this.wordTpe});
    this.detailForm.patchValue({lan: this.lan});
    this.detailForm.patchValue({word: this.word});
  }
  */

  getNewDetail(): WordDetail {
    const detail: WordDetail = {
      _id: '',
      article: 'de;het',
      lan: this.lan.slice(0, 2),
      word: this.word,
      docTpe: 'details',
      wordTpe: this.wordTpe
    };
    return detail;
  }

  getConfig(lanCode: string) {
    this.jazykService
    .fetchLanConfig(lanCode)
    .takeWhile(() => this.componentActive)
    .subscribe(
      config => {
        this.config = config;
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
    super.ngOnInit();
  }

  setDirty() {
    // checkbox change doesn't set form as dirty
    this.detailForm.markAsDirty();
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
      'wordTpe': [detail.wordTpe],
      'lan': [detail.lan],
      'word': [detail.word],
      'article': [new FormArray(articleControls), detail.wordTpe === 'noun' ? [Validators.required] : []]
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

  buildForm(detail: WordDetail) {
    detail = detail ? detail : this.getNewDetail();
    this.genera = this.config.genera;

    console.log('fr wordtpe', detail.wordTpe);

    this.detailForm = this.formBuilder.group({
      '_id': [detail._id],
      'docTpe': [detail.docTpe, [Validators.required]],
      'wordTpe': [detail.wordTpe, [Validators.required]],
      'lan': [detail.lan, [Validators.required]],
      'word': [detail.word, [Validators.required]],
      'genus': [detail.genus, detail.wordTpe === 'noun' ? [Validators.required] : []]
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
