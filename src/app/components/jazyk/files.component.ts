import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JazykService} from '../../services/jazyk.service';
import {ErrorService} from '../../services/error.service';
import {CloudFile, FilterFiles, LocalFile} from '../../models/jazyk.model';


@Component({
  templateUrl: 'files.component.html',
  styles: [`
    .files {width:340px;}
    .thumb {
      width:100px;
      border:1px solid #333;
    }
    .fa {
      font-size: 24px;
      cursor: pointer;
    }
    .name {
      float: right;
    }
  `]
})

export class JazykFilesComponent implements OnInit, OnDestroy {
  private componentActive = true;
  tpe: string;
  files: LocalFile[] = [];
  localFilePath: string;
  totalFiles: number;
  audio: any[] = [];

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

  onChange(file: any) {
    if (file.files[0]) {
      const legacyFile = file.files[0].name;
      this.jazykService
      .saveFileToCloud(legacyFile, this.tpe)
      .takeWhile(() => this.componentActive)
      .subscribe(
        savedFile => {
          if (savedFile) {
            console.log('saved file to cloud', savedFile);
            this.saveLocalFileRecord(savedFile, legacyFile);
          }
        },
        error => this.errorService.handleError(error)
      );
    }
  }

  onSelectedFilter(filter: FilterFiles) {
    this.fetchLocalFiles(filter);
  }

  onPlay(file: string, i: number) {
    if (!this.audio[i]) {
      this.audio[i] = new Audio();
      this.audio[i].src = this.localFilePath + file;
      this.audio[i].load();
      this.audio[i].play();
      this.audio[i].onplaying = () => {
        console.log('The audio is now playing');
      };
      this.audio[i].onended = () => {
        console.log('The audio has ended');
      };
    } else {
      if (this.audio[i].ended || this.audio[i].paused) {
        this.audio[i].play();
      } else {
        this.audio[i].pause();
      }
    }
  }

  private saveLocalFileRecord(cloudFile: CloudFile, legacyFile: string) {
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
