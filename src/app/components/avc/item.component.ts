import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AvcService} from '../../services/avc.service';
import {ErrorService} from '../../services/error.service';
import {Item} from '../../models/avc.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'km-item',
  templateUrl: 'item.component.html',
  styleUrls: ['form.component.css']
})

export class ItemComponent implements OnInit, OnDestroy {
  componentActive = true;
  isNew = false;
  item: Item;
  itemForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private avcService: AvcService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.activatedRoute.params
    .takeWhile(() => this.componentActive)
    .subscribe(
      params => {
        const lan = params['lan'],
              itemAlias = params['item'],
              cityAlias = params['city'];
        this.fetchItem(cityAlias, itemAlias, lan);
      }
    );
  }
  fetchItem(cityAlias: string, itemAlias: string, lan: string) {
    this.avcService
    .fetchItem(cityAlias, itemAlias, lan)
    .takeWhile(() => this.componentActive)
    .subscribe(
      item => {
        this.item = item;
        this.buildForm(item);
      },
      error => this.errorService.handleError(error)
    );
  }

  buildForm(item: Item) {
    const polyline = item.polyline ? item.polyline.coordinates.join('\n') : '';
    this.itemForm = this.formBuilder.group({
      _id: [item._id],
      lan: [item.lan],
      alias: [item.alias, [Validators.required]],
      name: [item.name, [Validators.required]],
      subTitle: [item.subTitle, [Validators.required]],
      prefix: [item.prefix],
      description: [item.description],
      address: [item.address],
      location: [item.location],
      metro: [item.metro],
      preview: [item.preview],
      content: [item.content],
      thumb: [item.thumb],
      photo: [item.photo],
      websites: [item.websites ? item.websites.join(';') : ''],
      categories: [item.categories ? item.categories.join(';') : ''],
      pos: [item.pos.coordinates.join(',')],
      polyline: [polyline],
      isPublish: [item.isPublished],
      isTopAttraction: [item.isTopAttraction],
      isQuality: [item.isQuality]
    });
  }

  onSubmit(itemForm: any) {
    if (this.isNew) {

    } else {
      this.updateItem(itemForm.value);
    }
  }

  updateItem(itemFormData: any) {
    this.avcService
    .updateItem(itemFormData)
    .takeWhile(() => this.componentActive)
    .subscribe(
      city => {
        // this.submitMessage = `Het woord ${wordPair.cz.word}/${wordPair.nl.word} is succesvol aangepast.`;
        this.isNew = false;
      },
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
