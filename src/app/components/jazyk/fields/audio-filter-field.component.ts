import {Component, Input, Output, OnDestroy, EventEmitter} from '@angular/core';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {LocalFile, FilterFiles, File} from '../../../models/jazyk.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'km-audio-filter',
  template: `
    <km-filter-files
      tpe="audio" 
      [word]="word"
      (selectedFilter)="onSelectedAudioFilter($event)">
    </km-filter-files>
    <ul class="list-group files">
      <li *ngFor="let file of audios; let i=index" class="list-group-item" (click)="selectAudio(i)">
        <div class="fdata">{{file.name}}</div>
        <km-audio-file
          [fileName]="file.localFile">
        </km-audio-file>
      </li>
    </ul>
  `,
  styleUrls: ['files.css']
})
export class JazykAudioFieldComponent implements OnDestroy {
  @Input() lan: string;
  @Input() word: string;
  @Output() selectedAudio = new EventEmitter<File>();
  private componentActive = true;
  audios: LocalFile[];
  localAudioFilePath: string;

  constructor (
    private errorService: ErrorService,
    private jazykService: JazykService
  ) {}

  onSelectedAudioFilter(filter: FilterFiles) {
    filter.lanCode = this.lan;
    console.log('selected audio', filter, this.lan);
    this.jazykService
    .getLocalFiles(filter)
    .takeWhile(() => this.componentActive)
    .subscribe(
      data => {
        console.log('audio data', data);
        this.audios = data.files;
        // this.totalAudios = data.total
      },
      error => this.errorService.handleError(error)
    );
  }

  selectAudio(i: number) {
    const audio: LocalFile = this.audios[i];
    let selected: File;
    if (audio) {
      selected = {
        s3: audio.cloudFile,
        local: audio.localFile
      };
      this.selectedAudio.emit(selected);
    }
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
