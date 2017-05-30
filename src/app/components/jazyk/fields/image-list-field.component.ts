import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {JazykService} from '../../../services/jazyk.service';
import {LocalFile, FilterFiles, Image} from '../../../models/jazyk.model';

@Component({
  selector: 'km-image-list',
  template: `
    <ul class="list-unstyled files">
      <li *ngFor="let image of images; let i=index" (click)="onRemove(i)" class="image">
        <img src="{{this.localImageFilePath + image.local}}" class="thumb" >
      </li>
    </ul>
    <div class="clearfix"></div>
  `,
  styleUrls: ['files.css']
})
export class JazykImageListComponent implements OnInit {
  @Input() images: Image[];
  @Output() removeImage = new EventEmitter<number>();
  localImageFilePath: string;

  constructor (
    private jazykService: JazykService
  ) {}

  ngOnInit() {
    this.localImageFilePath = this.jazykService.getFilePath('images');
  }

  onRemove(i) {
    console.log('remove', this.images[i]);
    this.removeImage.emit(i);
  }
}
