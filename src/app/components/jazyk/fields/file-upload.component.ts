import {Component, OnDestroy} from '@angular/core';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'km-file-upload',
  template: `
  <input id="fileupload" name="myfile" type="file" (change)="onChange(file)" #file />
  `
})
export class JazykFileUploadComponent implements OnDestroy {
  componentActive = true;

  constructor (
    private errorService: ErrorService,
    private jazykService: JazykService
  ) {}

  onChange(file: any) {
    console.log('file', file.files[0].name);

    this.jazykService.saveFile(file.files[0].name)
    .takeWhile(() => this.componentActive)
    .subscribe(
      savedFile => {
        console.log('saved file', savedFile);
      },
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
