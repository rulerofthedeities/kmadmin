import {Component, OnDestroy} from '@angular/core';
import {JazykService} from '../../services/jazyk.service';
import {ErrorService} from '../../services/error.service';


@Component({
  template: `
    <h4>Rename files from shtooka</h4>
    <p>expand all audio files into the d:/audio/process/input directory</p>
    <p>the index.tags.txt files must contain the Swac index tags</p>
    <p>This tool will rename the files with the actual word</p>

    <div class="btn btn-success" (click)="start()">Convert files<div>
  `
})

export class JazykProcessAudioComponent implements OnDestroy {
  private componentActive = true;

  constructor(
    private errorService: ErrorService,
    private jazykService: JazykService
  ) {}

  start() {
    this.processAudioFiles();
  }

  private processAudioFiles() {
    this.jazykService
    .renameAudioFiles()
    .takeWhile(() => this.componentActive)
    .subscribe(
      result => {
        if (result) {
          console.log('renamed files', result);
        }
      },
      error => this.errorService.handleError(error)
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
