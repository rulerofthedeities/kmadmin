import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {JazykService} from '../../../services/jazyk.service';
import {LocalFile, FilterFiles, File} from '../../../models/jazyk.model';

@Component({
  selector: 'km-image-list',
  template: `
    <ul class="list-unstyled files">
      <li *ngFor="let image of images; let i=index" (click)="onRemove(i)" class="image">
        <img src="{{getImageUrl(image)}}" class="thumb" >
      </li>
    </ul>
    <div class="clearfix"></div>
  `,
  styleUrls: ['files.css']
})
export class JazykImageListComponent implements OnInit {
  @Input() images: File[];
  @Output() removeImage = new EventEmitter<number>();
  localImageFilePath: string;

  constructor (
    private jazykService: JazykService
  ) {}

  ngOnInit() {
    this.localImageFilePath = this.jazykService.getFilePath('images');
  }

  onRemove(i) {
    this.removeImage.emit(i);
  }

  getImageUrl(file: File) {
    return this.localImageFilePath + file.local.replace('#', '%23');
  }
}
