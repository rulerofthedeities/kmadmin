import {Component, Input, OnInit} from '@angular/core';
import {LocalFile} from '../../../models/jazyk.model';
import {JazykService} from '../../../services/jazyk.service';

@Component({
  selector: 'km-audio-file',
  template: `
    <span (click)="onPlay()" class="fa fa-play-circle" [ngClass]="{
      'fa-play-circle': !audio || audio.ended ? true : false,
      'fa-pause-circle': audio && !audio.ended ? true : false
      }">
    </span>
  `,
  styleUrls: ['./files.css']
})

export class JazykAudioFileComponent implements OnInit {
  @Input() fileName: string;
  localFilePath: string;
  audio: any;

  constructor(
    private jazykService: JazykService
  ) {}

  ngOnInit() {
    this.localFilePath = this.jazykService.getFilePath('audio');
  }

  onPlay() {
    event.stopPropagation();
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.src = this.localFilePath + this.fileName.replace('#', '%23');
      this.audio.load();
    } else {
      if (this.audio.ended || this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    }
    this.audio.onended = () => {
      console.log('The audio has ended');
    };
    this.audio.onloadeddata = () => {
      console.log('The audio has loaded');
      this.audio.play();
    };
    this.audio.onplaying = () => {
      console.log('The audio is now playing');
    };
  }
}
