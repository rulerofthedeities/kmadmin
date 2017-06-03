import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {JazykService} from '../../../services/jazyk.service';
import {LocalFile, FilterFiles, File} from '../../../models/jazyk.model';

@Component({
  selector: 'km-audio-list',
  template: `
    <ul class="list-group files">
      <li *ngFor="let audio of audios; let i=index" (click)="onRemove(i)" class="list-group-item audio">
        <km-audio-file
          [fileName]="audio.local">
        </km-audio-file>
      </li>
    </ul>
    <div class="clearfix"></div>
  `,
  styleUrls: ['files.css']
})
export class JazykAudioListComponent implements OnInit {
  @Input() audios: File[];
  @Output() removeAudio = new EventEmitter<number>();
  localAudioFilePath: string;

  constructor (
    private jazykService: JazykService
  ) {}

  ngOnInit() {
    this.localAudioFilePath = this.jazykService.getFilePath('audio');
  }

  onRemove(i) {
    this.removeAudio.emit(i);
  }
}
