import {Component, ViewChild, OnInit, OnDestroy, ComponentFactory, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FilterList, Filter, WordPair, WordDetail} from '../../models/jazyk.model';
import {JazykService} from '../../services/jazyk.service';
import {JazykEditWordPairComponent} from './wordpair/edit-wordpair.component';
import {JazykDetailForm} from './worddetail/edit-worddetail.component';
import {JazykDetailFormNlComponent} from './worddetail/edit-worddetail-nl.component';
import {JazykDetailFormCsComponent} from './worddetail/edit-worddetail-cs.component';
import {JazykDetailFormDeComponent} from './worddetail/edit-worddetail-de.component';
import {JazykDetailFormEnComponent} from './worddetail/edit-worddetail-en.component';
import {JazykDetailFormFrComponent} from './worddetail/edit-worddetail-fr.component';
import 'rxjs/add/operator/takeWhile';

@Component({
  templateUrl: 'edit.component.html'
})

export class JazykEditComponent implements OnInit, OnDestroy {
  private componentActive = true;
  wordpairs: WordPair[] = [];
  worddetails: WordDetail[] = [];
  detail: WordDetail;
  lan: string;
  tpe: string;
  @ViewChild('edit') editWordPairs: JazykEditWordPairComponent;
  @ViewChild('placeholder', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef;
  cmpRef: any;

  constructor(
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private jazykService: JazykService
  ) {}

  ngOnInit() {
    this.route
    .data
    .takeWhile(() => this.componentActive)
    .subscribe(data => this.tpe = data.tpe);
  }

  onWordsFiltered(filterList: FilterList) {
    // Show list of filtered words
    this.wordpairs = filterList.wordpairs;
    this.worddetails = filterList.worddetails;
    if (this.lan !== filterList.filter.lanCode) {
      // Language changed -> load different component
      this.lan = filterList.filter.lanCode;
      if (this.viewContainerRef) {
        this.viewContainerRef.clear();
        const factory = this.componentFactoryResolver.resolveComponentFactory(this.getDetailComponent(this.lan));
        const cmpRef = this.viewContainerRef.createComponent(factory);
        cmpRef.instance['detail'] = this.detail;
        cmpRef.instance['lan'] = this.lan;
        cmpRef.instance['detailOnly'] = true;
        this.cmpRef = cmpRef;
      }
    }
  }

  onSelectedWordPair(filterWord: Filter) {
    // Edit selected word in all available languages
    this.editWordPairs.editNewWords(filterWord);
  }

  onSelectedWordDetail(worddetail: WordDetail) {
    this.detail = worddetail;
    if (this.cmpRef) {
      this.cmpRef.instance['detail'] = this.detail;
      this.cmpRef.instance['detailOnly'] = true;
      this.cmpRef.instance['detailExists'] = true;
      this.jazykService.detailChanged.emit(true);
    }
  }

  private getDetailComponent(lan: string): any {
    console.log(lan);
    let comp: any;
    switch (lan) {
      case 'nl': comp = JazykDetailFormNlComponent; break;
      case 'fr': comp = JazykDetailFormFrComponent; break;
      case 'de': comp = JazykDetailFormDeComponent; break;
      case 'cs': comp = JazykDetailFormCsComponent; break;
      case 'en': comp = JazykDetailFormEnComponent; break;
      default: comp = JazykDetailFormNlComponent;
    }

    return comp;
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
