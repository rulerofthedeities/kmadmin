import {Component, Input, Output, OnDestroy, EventEmitter, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {JazykService} from '../../services/jazyk.service';
import {ErrorService} from '../../services/error.service';
import {AltWord, WordDetail, Filter} from '../../models/jazyk.model';

@Component({
  selector: 'km-alt-field',
  template: `
  <ul class="list-unstyled">
    <li *ngFor="let word of words; let i=index">
      {{word.word}}
      <span class="fa fa-file-text"
        [tooltip]="detailTooltip" tooltipPlacement="bottom"
        (mouseover)="getDetail(word.detailId)" 
        (click)="findDetail(word.word, i)"
        [class.details]="word.detailId"></span>
      <span class="fa fa-times remove"
        (click)="remove(i)"></span>
      <tooltip-content #detailTooltip>
        <div *ngIf="!detail">No detail</div>
        <div *ngIf="detail">
          {{detail|json}}
        </div>
      </tooltip-content>
    </li>
    <li>
      <div class="input-group">
        <input 
          type="text"
          class="form-control"
          id="newAlt" #newalt>
        <span class="input-group-btn">
          <button type="button" class="btn btn-default" (click)="addNewWord(newalt.value)">Add</button>
        </span>
      </div>
    </li>
  </ul>
  `,
  styles: [`
    .remove {color: red;}
    .details {color: green;}
  `]
})


export class JazykEditAltFieldComponent implements OnDestroy {
  @Input() words: AltWord[] = [];
  @Input() lanCode: string;
  @Input() wordTpe: string;
  @Output() updatedWords = new EventEmitter<AltWord[]>();
  @ViewChild('newalt') altField;
  detail: WordDetail;
  componentActive = true;

  constructor(
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private jazykService: JazykService
  ) {}

  getDetail(detailId: string) {
    this.detail = null;
    if (detailId) {
      this.fetchWordDetailById(detailId);
    }
  }

  findDetail(word: string, i: number) {
    this.fetchWordDetailByWord(word, i);
  }

  remove(i: number) {
    this.words.splice(i, 1);
    this.updatedWords.emit(this.words);
  }

  addNewWord(word: string) {
    word = word.trim();
    if (!this.words) {
      this.words = [];
    }
    this.words.push({word: word});
    this.updatedWords.emit(this.words);
    this.fetchWordDetailByWord(word, this.words.length - 1);
  }

  private fetchWordDetailById(detailId: string) {
    this.jazykService
    .fetchWordDetailById(detailId)
    .takeWhile(() => this.componentActive)
    .subscribe(
      (data: WordDetail) => {
        this.detail = data;
      },
      error => this.errorService.handleError(error)
    );
  }

  private fetchWordDetailByWord(word: string, i: number) {
    const filter: Filter = {
      word,
      lanCode: this.lanCode,
      wordTpe: this.wordTpe
    };
    this.jazykService
    .fetchWordDetailByFilter(filter)
    .takeWhile(() => this.componentActive)
    .subscribe(
      (data: WordDetail[]) => {
        this.altField.nativeElement.value = '';
        if (data[0]) {
          this.words[i].detailId = data[0]._id;
        }
      },
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
