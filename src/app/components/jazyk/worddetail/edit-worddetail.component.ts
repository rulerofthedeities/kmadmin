import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {WordDetail, LanConfig, Filter, TpeList, Language} from '../../../models/jazyk.model';
import 'rxjs/add/operator/takeWhile';

export abstract class JazykDetailForm implements OnChanges, OnInit {
  @Input() wordTpe: string;
  @Input() lan: string;
  @Input() word: string;
  @Input() detail: WordDetail;
  @Input() detailOnly = false;
  private componentActive = true;
  detailForm: FormGroup;
  detailExists = false;
  config: LanConfig;
  languages: Language[];
  wordTpes: TpeList[];

  constructor(
    public formBuilder: FormBuilder,
    private errorService: ErrorService,
    private jazykService: JazykService
  ) {}

  ngOnInit() {
    this.languages = this.jazykService.getLanguages();
    this.wordTpes = this.jazykService.getWordTypes();
    this.jazykService.detailChanged.subscribe( detailOnly => {
      this.detailOnly = detailOnly;
      this.processChanges();
    });
    this.getConfig(this.lan);
  }

  ngOnChanges() {
    this.processChanges();
  }

  processChanges() {
    this.detailExists = this.detail && this.detail._id ? true : false;
    if (this.config) {
      this.buildForm();
    } else {
      this.getConfig(this.lan);
    }
  }

  buildForm() {
    this.detail = this.detail ? this.detail : this.getNewDetail();
    this.buildDetailForm();
  }

  buildDetailForm() {
    if (!this.detailOnly) {
      // get data from wordpair
      this.detail.wordTpe = this.wordTpe;
      this.detail.lan = this.lan;
      this.detail.word = this.word;
    }
    this.detailForm = this.formBuilder.group({
      '_id': [this.detail._id],
      'docTpe': ['details'],
      'wordTpe': [this.detail.wordTpe],
      'lan': [this.detail.lan],
      'word': [this.detail.word]
    });
  }

  updateDetail(formdetail: WordDetail) {
    const worddetail = this.postProcessFormData(formdetail);
    console.log('updating', worddetail, 'in db');
    this.jazykService
    .updateWordDetail(worddetail)
    .takeWhile(() => this.componentActive)
    .subscribe(
      updatedWordDetail => {
        this.detailForm.markAsPristine();
      },
      error => this.errorService.handleError(error)
    );
  }

  addDetail(formdetail: WordDetail) {
    const worddetail = this.postProcessFormData(formdetail);
    console.log('adding', worddetail, 'to db');
    this.jazykService
    .addWordDetail(worddetail)
    .takeWhile(() => this.componentActive)
    .subscribe(
      addedWordDetail => {
        this.detail._id = addedWordDetail._id;
        this.detailForm.markAsPristine();
        this.detailExists = true;
      },
      error => this.errorService.handleError(error)
    );
  }

  postProcessFormData(data: any): any {
    return data;
  }

  setDirty() {
    // checkbox change doesn't set form as dirty
    this.detailForm.markAsDirty();
  }

  copyDetail(data: any): WordDetail {
    const detail: WordDetail = {
      _id: data._id,
      docTpe: data.docTpe,
      lan: data.lan,
      word: data.word,
      wordTpe: data.wordTpe
    };
    return detail;
  }

  addNewField(formData: any, newData: any, field: string) {
    // Postprocess
    if (formData[field]) {
      newData[field] = formData[field];
    }
  }

  addNewArray(formData: any, newData: any, field: string, max: number) {
    let newArr = [];
    if (max > 1) {
      // There is a separate field for each value
      for (let i = 0; i < max; i++) {
        if (formData[field + i]) {
          newArr.push(formData[field + i]);
        }
      }
    } else {
      // All values are in one field
      newArr = formData[field].split(';');
    }
    newData[field] = newArr;
  }

  newDetail() {
    this.detail = null;
    this.detailExists = false;
    this.buildForm();
  }

  isNoun() {
    return this.detailForm.value['wordTpe'] === 'noun';
  }

  isPronoun() {
    return this.detailForm.value['wordTpe'] === 'pronoun';
  }

  isPreposition() {
    return this.detailForm.value['wordTpe'] === 'preposition';
  }

  isAdjective() {
    return this.detailForm.value['wordTpe'] === 'adjective';
  }

  isVerb() {
    return this.detailForm.value['wordTpe'] === 'verb';
  }

  isRead() {
    return !this.detailOnly || this.detailExists;
  }

  getNewDetail(): WordDetail {
    console.log('new detail - word:', this.word);
    const detail: WordDetail = {
      _id: '',
      lan: this.lan ? this.lan : '',
      word: this.word ? this.word : '',
      docTpe: 'details',
      wordTpe: this.wordTpe ? this.wordTpe : ''
    };
    console.log('new detail:', detail);
    return detail;
  }

  getConfig(lanCode: string) {
    this.jazykService
    .fetchLanConfig(lanCode)
    .takeWhile(() => this.componentActive)
    .subscribe(
      config => {
        if (config) {
          this.config = config;
          this.buildForm();
        }
      },
      error => this.errorService.handleError(error)
    );
  }
}
