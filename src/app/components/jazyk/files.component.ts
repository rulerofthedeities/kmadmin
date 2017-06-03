import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JazykService} from '../../services/jazyk.service';
import {ErrorService} from '../../services/error.service';
import {CloudFile, FilterFiles, LocalFile} from '../../models/jazyk.model';


@Component({
  templateUrl: 'files.component.html',
  styleUrls: ['./files.component.css']
})

export class JazykFilesComponent implements OnInit, OnDestroy {
  private componentActive = true;
  tpe: string;
  files: LocalFile[] = [];
  localFilePath: string;
  totalFiles: number;

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
      this.localFilePath = this.jazykService.getFilePath(this.tpe);
      const filter = {
        app: 'jazyk',
        tpe: data.tpe,
        word: ''
      };
      this.fetchLocalFiles(filter);
    });
  }

  onChange(selectedFiles: any) {
    const files = selectedFiles.files; // note: object, not an array
    const nrOfFiles = files.length;
    let legacyFile;
    for (let i = 0; i < nrOfFiles; i++) {
      legacyFile = files[i];
      if (legacyFile) {
        this.jazykService
        .saveFileToCloud(legacyFile, this.tpe)
        .takeWhile(() => this.componentActive)
        .subscribe(
          result => {
            if (result) {
              if (result.isDuplicate) {
                console.log('File %s already exists', result.legacyFile.name);
              } else {
                console.log('saved file to cloud', result.file);
                this.saveLocalFileRecord(result.file, result.legacyFile);
              }
            }
          },
          error => this.errorService.handleError(error)
        );
      }
    }
  }

  onSelectedFilter(filter: FilterFiles) {
    this.fetchLocalFiles(filter);
  }

  getImageUrl(file: LocalFile) {
   const url = this.localFilePath + file.localFile.replace('#', '%23');
   return url;
  }

  private saveLocalFileRecord(cloudFile: CloudFile, legacyFile: any) {
    this.jazykService
    .saveCloudFileData(cloudFile, legacyFile, this.tpe)
    .takeWhile(() => this.componentActive)
    .subscribe(
      savedFile => {
        this.files.push(savedFile);
        this.totalFiles++;
      },
      error => this.errorService.handleError(error)
    );
  }

  private fetchLocalFiles(filter: FilterFiles) {
    this.jazykService
    .getLocalFiles(filter)
    .takeWhile(() => this.componentActive)
    .subscribe(
      data => {
        this.files = data.files;
        this.totalFiles = data.total;
      },
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
