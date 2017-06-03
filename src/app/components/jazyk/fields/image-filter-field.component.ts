import {Component, OnInit, Output, OnDestroy, EventEmitter} from '@angular/core';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {LocalFile, FilterFiles, File} from '../../../models/jazyk.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'km-image-filter',
  template: `
    <km-filter-files
      tpe="images" 
      (selectedFilter)="onSelectedImageFilter($event)">
    </km-filter-files>
    <ul class="list-group files">
      <li *ngFor="let file of images; let i=index" class="list-group-item" (click)="selectImage(i)">
        <div class="fdata">{{file.name}}</div>
        <img src="{{getImageUrl(file)}}" class="thumb">
      </li>
    </ul>
  `,
  styleUrls: ['files.css']
})
export class JazykImageFieldComponent implements OnInit, OnDestroy {
  @Output() selectedImage = new EventEmitter<File>();
  private componentActive = true;
  images: LocalFile[];
  localImageFilePath: string;

  constructor (
    private errorService: ErrorService,
    private jazykService: JazykService
  ) {}

  ngOnInit() {
    this.localImageFilePath = this.jazykService.getFilePath('images');
  }

  onSelectedImageFilter(filter: FilterFiles) {
    console.log('selected image', filter);
    this.jazykService
    .getLocalFiles(filter)
    .takeWhile(() => this.componentActive)
    .subscribe(
      data => {
        console.log('image data', data);
        this.images = data.files;
        // this.totalImages = data.total
      },
      error => this.errorService.handleError(error)
    );
  }

  selectImage(i: number) {
    console.log('selected ', this.images[i]);
    const image: LocalFile = this.images[i];
    let selected: File;
    if (image) {
      selected = {
        s3: image.cloudFile,
        local: image.localFile
      };
      this.selectedImage.emit(selected);
    }
  }

  getImageUrl(file: LocalFile) {
    return this.localImageFilePath + file.localFile.replace('#', '%23');
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
