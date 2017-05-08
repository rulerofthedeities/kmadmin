import {Component, Input, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {JazykDetailForm} from './edit-word-detail.component';
import {JazykService} from '../../services/jazyk.service';
import {ErrorService} from '../../services/error.service';
import {DetailFilterData, Filter, TpeList, Language, WordPair, WordDetail} from '../../models/jazyk.model';

interface DetailHelper {
  hasDetail: boolean;
  showDetail: boolean;
}

interface FormHelper {
  detail1: DetailHelper;
  detail2: DetailHelper;
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
      tags: []
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
    this.jazykService
    .fetchFilterWordDetail(filter)
    .takeWhile(() => this.componentActive)
    .subscribe(
      (data: WordDetail[]) => {
        this['detail' + w] = data[0];
        if (data.length > 0) {
          this.formHelpers[i]['detail' + w].hasDetail = true;
          this.formHelpers[i]['detail' + w].showDetail = true;
        }
      },
      error => this.errorService.handleError(error)
    );

    this.jazykService
    .checkWordPairExists(this.detailFilterData[i])
    .takeWhile(() => this.componentActive)
    .subscribe(
      data => {
        console.log('check wordpair exists', data);
      },
      error => this.errorService.handleError(error)
    );
  }

  onSubmit(wordForm: any, i: number) {
    // TODO: check if wordpair already exists
    if (this.isNew[i]) {
      this.addWordPair(wordForm, i);
    } else {
      this.updateWordPair(wordForm.value, i);
    }

    // TODO: validate detail forms

    this.submitDetail(this.detailForm1);
    this.submitDetail(this.detailForm2);
  }

  submitDetail(detailForm: JazykDetailForm) {
    if (detailForm.detailExists && detailForm.detailForm.dirty) {
      detailForm.update();
    } else if (!detailForm.detailExists) {
      detailForm.add();
    }
  }

  onToggleDisplay(form_i, detail_i, show) {
    this.formHelpers[form_i]['detail' + detail_i].showDetail = show;
  }

  buildWordpairForm(wordpair: WordPair): FormGroup {
    const lan1 = wordpair.lanPair[0].slice(0, 2),
          lan2 = wordpair.lanPair[1].slice(0, 2),
          wordpairForm = this.formBuilder.group({
      '_id': [wordpair._id],
      'docTpe': [wordpair.docTpe],
      'wordTpe': [wordpair.wordTpe, [Validators.required]],
      'lan1': [lan1],
      'lan2': [lan2],
      'word1': [wordpair[lan1] ? wordpair[lan1].word : '', [Validators.required]],
      'word2': [wordpair[lan2] ? wordpair[lan2].word : '', [Validators.required]],
      'alt1': [wordpair[lan1] ? wordpair[lan1].alt : ''],
      'alt2': [wordpair[lan2] ? wordpair[lan2].alt : ''],
      'hint1': [wordpair[lan1] ? wordpair[lan1].hint : ''],
      'hint2': [wordpair[lan2] ? wordpair[lan2].hint : ''],
      'info1': [wordpair[lan1] ? wordpair[lan1].info : ''],
      'info2': [wordpair[lan2] ? wordpair[lan2].info : '']
    });
     return wordpairForm;
  }

  addWordPair(wordpairData: any, i: number) {
    console.log('Adding wordpair to db', wordpairData);
    this.jazykService
    .addWordPair(wordpairData)
    .takeWhile(() => this.componentActive)
    .subscribe(
      result => {
        // this.submitMessage = `Het woord ${wordPair.cz.word}/${wordPair.nl.word} is succesvol aangepast.`;
        this.isNew[i] = false;
      },
      error => this.errorService.handleError(error)
    );
  }

  updateWordPair(wordpair: WordPair, i: number) {
    console.log('Updating wordpair in db', wordpair);
  }

  getLanguageName(lanCode: string) {
    return this.jazykService.getLanguageName(lanCode);
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
