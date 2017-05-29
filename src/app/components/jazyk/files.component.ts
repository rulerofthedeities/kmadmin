import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JazykService} from '../../services/jazyk.service';
import {ErrorService} from '../../services/error.service';
import {CloudFile} from '../../models/jazyk.model';

interface LocalFile {
  cloudFile: string;
  localFile: string;
  ETag: string;
  dtAdded: Date;
}

@Component({
  template: `
  Add {{tpe}} file:
  <input 
    id="fileupload"
    name="myfile"
    type="file" 
    (change)="onChange(file)" 
    #file />
  
  Files:
  <ul class="list-group imgs">
    <li *ngFor="let file of files" class="list-group-item">
      <img src="{{this.localFilePath + file.localFile}}" class="thumb">
      <span class="badge">{{file.localFile}}</span>
    </li>
  </ul>
  `,
  styles: [`
    .imgs {width:340px;}
    .thumb {
      width:100px;
      border:1px solid #333;
    }
  `]
})

export class JazykFilesComponent implements OnInit, OnDestroy {
  private componentActive = true;
  tpe: string;
  files: LocalFile[] = [];
  localFilePath = 'http://localhost:4700/images/';

  constructor(
    private route: ActivatedRoute,
    private errorService: ErrorService,
    private jazykService: JazykService
  ) {}

  ngOnInit() {
    this.route
    .data
    .takeWhile(() => this.componentActive)
    .subscribe(data => {
      this.tpe = data.tpe;
      this.fetchLocalFiles();
    });
  }

  onChange(file: any) {
    const legacyFile = file.files[0].name;
    this.jazykService
    .saveFile(legacyFile)
    .takeWhile(() => this.componentActive)
    .subscribe(
      savedFile => {
        console.log('saved file to cloud', savedFile);
        this.saveLocalFileRecord(savedFile, legacyFile);
      },
      error => this.errorService.handleError(error)
    );
  }

  private saveLocalFileRecord(cloudFile: CloudFile, legacyFile: string) {
    console.log('saving cloud file locally', cloudFile);
    this.jazykService
    .saveCloudFileData(cloudFile, legacyFile, this.tpe)
    .takeWhile(() => this.componentActive)
    .subscribe(
      savedFile => this.files.push(savedFile),
      error => this.errorService.handleError(error)
    );
  }

  private fetchLocalFiles() {
    this.jazykService
    .getLocalFiles(this.tpe)
    .takeWhile(() => this.componentActive)
    .subscribe(
      files => this.files = files,
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
