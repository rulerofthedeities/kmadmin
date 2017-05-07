import {Component, OnDestroy} from '@angular/core';
import {JazykService} from '../../services/jazyk.service';
import 'rxjs/add/operator/takeWhile';

@Component({
  template: `
    <h2>Jazyk</h2>

    <button class="btn btn-primary" (click)="onCompareWords()">
      Compare nl words
    </button>
    <button class="btn btn-primary" (click)="onCompareSentences()">
      Compare nl sentences
    </button>
    Compare nl words in cznl with nl words in jazyk
    <div class="compareResult" *ngIf="compare?.words">
      <div>{{compare.words|json}}</div>
      <button class="btn btn-danger" (click)="onRemoveWords()">
        Remove cz & nl words from jazyk
      </button><br>
      <div>{{removed|json}}</div><br>
      <button class="btn btn-warning" (click)="onAddWords()">
        Add new nl words
      </button><br>
      <div>{{added|json}}</div><br>
    
    </div>
    <div class="compareResult" *ngIf="compare?.sentences">
      <div>{{compare.sentences|json}}</div>
      <button class="btn btn-warning" (click)="onAddSentences()">
        Add new nl sentences
      </button>
    </div>

  `
})

export class CznlImportComponent implements OnDestroy {
  componentActive = true;
  compare = {words: null, sentences: null};
  removed: any;
  added: any;

  constructor(
    private jazykService: JazykService
  ) {}

  onCompareWords() {
    this.jazykService
    .compareNlWords()
    .takeWhile(() => this.componentActive)
    .subscribe(
      result => {this.compare.words = result; }
    );
  }

  onCompareSentences() {
    this.jazykService
    .compareNlSentences()
    .takeWhile(() => this.componentActive)
    .subscribe(
      result => {this.compare.sentences = result; }
    );
  }

  onRemoveWords() {
    this.jazykService
    .removeWords()
    .takeWhile(() => this.componentActive)
    .subscribe(
      result => {this.removed = result; console.log(result); }
    );
  }

  onAddWords() {
    this.jazykService
    .addNlWords()
    .takeWhile(() => this.componentActive)
    .subscribe(
      result => {this.added = result; console.log(result); }
    );
  }

  onAddSentences() {
    this.jazykService
    .addNlSentences()
    .takeWhile(() => this.componentActive)
    .subscribe(
      result => {console.log(result); }
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
