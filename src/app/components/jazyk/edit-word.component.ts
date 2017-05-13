import {Component, Input, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {JazykDetailForm} from './edit-word-detail.component';
import {JazykService} from '../../services/jazyk.service';
import {ErrorService} from '../../services/error.service';
import {DetailFilterData, Filter, TpeList, Language, AltWord, WordPair, WordDetail} from '../../models/jazyk.model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

interface DetailHelper {
  hasDetail: boolean;
  showDetail: boolean;
}

interface Msg {
  txt: string;
  tpe: string;
}

interface FormHelper {
  detail1: DetailHelper;
  detail2: DetailHelper;
  wordPairExists: boolean;
  msg: Msg;
}

@Component({
  selector: 'km-edit-word',
  templateUrl: 'edit-word.component.html',
  styleUrls: ['edit-word.component.css']
})

export class JazykEditWordComponent implements OnInit, OnDestroy {
  @Input() wordpairs: WordPair[] = [];
  @ViewChild('df1') detailForm1: JazykDetailForm;
  @ViewChild('df2') detailForm2: JazykDetailForm;
  componentActive = true;
  wordForms: FormGroup[] = [];
  detail1: WordDetail;
  detail2: WordDetail;
  formHelpers: FormHelper[] = [];
  isNew: boolean[] = [];
  isSubmitted: boolean[] = [];
  languages: Language[];
  wordTpes: TpeList[];
  detailFilterData: DetailFilterData[] = []; // Bound with ngmodel to get the data to find the word details

  constructor(
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private jazykService: JazykService
  ) {}

  ngOnInit() {
    this.languages = this.jazykService.getLanguages();
    this.wordTpes = this.jazykService.getWordTypes();
    this.isSubmitted[0] = false;
    this.detailFilterData[0] = {
      word1: '',
      lan1: 'nl-nl',
      word2: '',
      lan2: 'fr-fr',
      tpe: ''
    };
    this.formHelpers[0] = {
      detail1: { hasDetail: false, showDetail: false},
      detail2: { hasDetail: false, showDetail: false},
      wordPairExists: false,
      msg: {txt: '', tpe: ''}
    };
    if (this.wordpairs) {
      this.isNew[0] = false;
      // Fetch word details for all wordpairs
    } else {
      this.isNew[0] = true;
      this.createNewForm();
    }
  }

  createNewForm() {
    const wordpairs: WordPair[] = [];

    wordpairs[0] = {
      _id: '',
      docTpe: 'wordpair',
      wordTpe: '',
      lanPair: ['nl-nl', 'cs-cz'],
      tags: [],
      nl: {
        word: 'testword',
        alt: [{word: 'test1'}, {word: 'test2', detailId: '5911b1a45b925606f0d86fc8'}]}
    };
    this.buildForms(wordpairs);
  }

  buildForms(wordpairs: WordPair[]) {
    let i = 0;
    wordpairs.forEach(wordpair => {
      const wordForm = this.buildWordpairForm(wordpair);
      this.wordForms.push(wordForm);
      i++;
    });
  }

  onWordChanged(i: number, w: string) {
    this.formHelpers[i].msg = {txt: '', tpe: ''};
    this.formHelpers[i]['detail' + w].hasDetail = false;

    // Look for a word detail document for this word
    const filter: Filter = {
      word: this.detailFilterData[i]['word' + w],
      lanCode: this.detailFilterData[i]['lan' + w],
      wordTpe: this.detailFilterData[i]['tpe'],
      isFromStart: true,
      isExact: true,
      returnTotal: false
    };
    console.log('filter', filter);
    this.jazykService
    .fetchWordDetailByFilter(filter)
    .takeWhile(() => this.componentActive)
    .subscribe(
      (data: WordDetail[]) => {
        console.log(data);
        if (data[0]) {
          // Set id in wordpair form
          this.wordForms[i].patchValue({['detailId' + w]: data[0]._id});
          // Form helpers
          this['detail' + w] = data[0];
          this.formHelpers[i]['detail' + w].hasDetail = true;
          this.formHelpers[i]['detail' + w].showDetail = true;
        } else {
          console.log('no detail');
          this.isNew[i] = true;
          this.wordForms[i].patchValue({['detailId' + w]: ''});
          this.formHelpers[i]['detail' + w].hasDetail = false;
          this['detail' + w] = null;
        }
      },
      error => this.errorService.handleError(error)
    );

    if (!this.wordForms[i].value['_id']) {
      // This wordpair has no id; check if this wordpair already exists
      this.jazykService
      .checkWordPairExists(this.detailFilterData[i])
      .takeWhile(() => this.componentActive)
      .subscribe(
        id => {
          console.log('check wordpair exists', id);
          this.formHelpers[i].wordPairExists = id ? true : false;
          if (id) {
            this.wordForms[i].patchValue({['_id']: id});
          }
        },
        error => this.errorService.handleError(error)
      );
    }
  }

  onAltWordsUpdated(altwords: AltWord[], i: number, w: string) {
    this.wordForms[i].patchValue({['alt' + w]: altwords});
  }

  onSubmit(wordFormData: any, i: number) {
    let isvalid = true;
    this.formHelpers[i].msg = {txt: '', tpe: ''};
    // TODO: check if wordpair already exists
    // TODO: get detail if new detail is added
    console.log('validate detailform1 ', this.detailForm1.detailForm.status, this.detailForm1.detailForm.valid);
    console.log('validate detailform2 ', this.detailForm2.detailForm.status, this.detailForm2.detailForm.valid);

    if (!this.wordForms[i].valid) {
      this.formHelpers[i].msg = {txt: 'Wordform is not valid', tpe: 'error'};
      isvalid = false;
    }

    if (!this.detailForm1.detailForm.valid) {
      this.formHelpers[i].msg = {txt: 'Detail form 1 is not valid', tpe: 'error'};
      isvalid = false;
    }

    if (!this.detailForm2.detailForm.valid) {
      this.formHelpers[i].msg = {txt: 'Detail form 2 is not valid', tpe: 'error'};
      isvalid = false;
    }

    if (isvalid) {
      // First save detail forms, and set detailId for wordform if new

      // this.submitDetail(this.detailForm1, wordFormData);
      // this.submitDetail(this.detailForm2, wordFormData);

      const detailFormData1 = this.detailForm1.postProcessFormData(this.detailForm1.detailForm.value);
      const detailFormData2 = this.detailForm2.postProcessFormData(this.detailForm2.detailForm.value);

      let save1, save2;
      save1 = this.addDetail(detailFormData1, this.detailForm1);
      save2 = this.addDetail(detailFormData2, this.detailForm2);

      if (detailFormData1._id && this.detailForm1.detailForm.dirty) {
        save1 = this.updateDetail(detailFormData1);
      }
      if (detailFormData2._id && this.detailForm2.detailForm.dirty) {
        save2 = this.updateDetail(detailFormData2);
      }

      const source = Observable.zip(
        save1,
        save2
      );

      source
      .takeWhile(() => this.componentActive)
      .subscribe(
        ids => {
          wordFormData.detailId1 = wordFormData.detailId1 || ids[0];
          wordFormData.detailId2 = wordFormData.detailId2 || ids[1];
          if (!this.formHelpers[0].wordPairExists) {
            this.addWordPair(wordFormData, i);
            this.formHelpers[i].wordPairExists = true;
          } else {
            if (this.wordForms[0].dirty) {
              this.updateWordPair(wordFormData, i);
            } else {
              this.formHelpers[i].msg = {
                txt: `Er waren geen updates aan het wordpair.`,
                tpe: 'success'
              };
            }
          }
          this.wordForms[i].markAsPristine();
        },
        err => console.log('Error: %s', err)
      );

    }
  }

  addDetail(detailFormData: any, df: JazykDetailForm): Observable<string> {
    return Observable.create(obs => {
      console.log('saving detail', detailFormData);
      if (detailFormData._id) {
        console.log('not saving');
        obs.next(detailFormData._id);
      } else {
        console.log('saving');
        this.jazykService
        .addWordDetail(detailFormData)
        .takeWhile(() => this.componentActive)
        .subscribe(
          savedWordDetail => {
            obs.next(savedWordDetail._id);
            df.detailExists = true;
            df.detailForm.markAsPristine();
          },
          error => obs.error(error)
        );
      }
    });
  }

  updateDetail(detailFormData: any): Observable<string> {
    return Observable.create(obs => {
      console.log('updating detail', detailFormData);
      if (!detailFormData._id) {
        console.log('not updating');
        obs.next('');
      } else {
        console.log('updating');
        this.jazykService
        .updateWordDetail(detailFormData)
        .takeWhile(() => this.componentActive)
        .subscribe(
          updatedWordDetail => {
            obs.next(detailFormData._id);
          },
          error => obs.error(error)
        );
      }
    });
  }

  addWordPair(wordpairData: any, i: number) {
    this.jazykService
    .addWordPair(wordpairData)
    .takeWhile(() => this.componentActive)
    .subscribe(
      result => {
        this.formHelpers[i].msg = {
          txt: `Het wordpair is succesvol toegevoegd aan de db.`,
          tpe: 'success'
        };
        this.isNew[i] = false;
      },
      error => this.errorService.handleError(error)
    );
  }

  updateWordPair(wordpairData: any, i: number) {
    console.log('Updating wordpair in db', wordpairData);
    if (wordpairData._id) {
      this.jazykService
      .updateWordPair(wordpairData)
      .takeWhile(() => this.componentActive)
      .subscribe(
        result => {
          this.formHelpers[i].msg = {
            txt: `Het wordpair is succesvol aangepast.`,
            tpe: 'success'
          };
        },
        error => this.errorService.handleError(error)
      );
    } else {
      console.log('Error: no wordpair id');
    }
  }

  onToggleDisplay(form_i, detail_i, show) {
    this.formHelpers[form_i]['detail' + detail_i].showDetail = show;
  }

  buildWordpairForm(wordpair: WordPair): FormGroup {
    const lan1 = wordpair.lanPair[0].slice(0, 2),
          lan2 = wordpair.lanPair[1].slice(0, 2),
          wordpairForm = this.formBuilder.group({
      _id: [wordpair._id],
      docTpe: [wordpair.docTpe],
      wordTpe: [wordpair.wordTpe, [Validators.required]],
      lan1: [lan1],
      lan2: [lan2],
      word1: [wordpair[lan1] ? wordpair[lan1].word || '' : '', [Validators.required]],
      word2: [wordpair[lan2] ? wordpair[lan2].word || '' : '', [Validators.required]],
      alt1: [wordpair[lan1] ? wordpair[lan1].alt || '' : []],
      alt2: [wordpair[lan2] ? wordpair[lan2].alt || '' : []],
      hint1: [wordpair[lan1] ? wordpair[lan1].hint || '' : ''],
      hint2: [wordpair[lan2] ? wordpair[lan2].hint || '' : ''],
      info1: [wordpair[lan1] ? wordpair[lan1].info || '' : ''],
      info2: [wordpair[lan2] ? wordpair[lan2].info || '' : ''],
      detailId1: [wordpair[lan1] ? wordpair[lan1].detailId || '' : ''],
      detailId2: [wordpair[lan2] ? wordpair[lan2].detailId || '' : '']
    });
     return wordpairForm;
  }

  getLanguageName(lanCode: string) {
    return this.jazykService.getLanguageName(lanCode);
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
