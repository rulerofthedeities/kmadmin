import {Component, Input, Output, EventEmitter} from '@angular/core';
import {WordPair, Filter} from '../../models/jazyk.model';

@Component({
  selector: 'km-filter-list',
  template: `
    <ul class="list-group wordpairList">
      <li *ngFor="let wordpair of wordpairs; let i = index"
        class="list-group-item"
        (click)="selectListWord(i)"
        [ngClass]="{'active': i === selectedListWord,'inactive': i !== selectedListWord}">
         
        <div [tooltip]="wordpairTooltip" tooltipPlacement="top">
          {{getWord(wordpair)}}
        </div>

        <tooltip-content #wordpairTooltip>
          <ul class="list-unstyled">
            <li class="wordpairTT">
              {{wordpair.wordTpe}}
            </li>
            <li class="wordpairTT">
              <span class="ttLbl">{{wordpair.lanPair[0]}}:</span> {{wordpair[wordpair.lanPair[0].slice(0,2)].word}}
            </li>
            <li class="wordpairTT">
              <span class="ttLbl">{{wordpair.lanPair[1]}}:</span> {{wordpair[wordpair.lanPair[1].slice(0,2)].word}}
            </li>
          </ul>
        </tooltip-content>
      </li>
    </ul>
  `,
  styles: [`
    .wordpairList li{
      padding: 2px 5px;
      cursor: pointer;
    }
    .wordpairList li:hover {
      background-color: #eee;
    }
    .wordpairTT {
      text-align: left;
    }
    .ttLbl{
      color: #00b3ee;
    }
  `]
})

export class JaykEditFilterListComponent {
  @Input() wordpairs: WordPair[];
  @Input() lan: string;
  @Output() selectedWord = new EventEmitter<Filter>();

  getWord(wordpair: WordPair): string {
    const lan = this.lan.slice(0, 2);
    let word = '';
    if (wordpair && wordpair[lan]) {
      word = wordpair[lan].word;
    }
    return word;
  }

  selectListWord(i: number) {
    const lan = this.lan.slice(0, 2);
    const wordListFilter: Filter = {
      word: this.wordpairs[i][lan].word,
      lanCode: this.lan,
      wordTpe: this.wordpairs[i].wordTpe
    }
    this.selectedWord.emit(wordListFilter);
  }
}
