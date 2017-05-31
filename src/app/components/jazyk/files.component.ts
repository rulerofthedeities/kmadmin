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
  audioState: string[] = [];

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
    if (this.audioState[i] !== 'playing') {
      const audio = new Audio();
      audio.src = this.localFilePath + file;
      audio.load();
      audio.play();

      audio.onplaying = () => {
        this.audioState[i] = 'playing';
        console.log('The audio is now playing');
      };
      audio.onended = () => {
        this.audioState[i] = 'ended';
        console.log('The audio has ended');
      };
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
