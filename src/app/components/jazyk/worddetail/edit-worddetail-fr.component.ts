import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {WordDetail} from '../../../models/jazyk.model';
import {JazykDetailForm} from './edit-worddetail.component';

@Component({
  selector: 'km-detail-form-fr',
  templateUrl: 'edit-worddetail-fr.component.html',
  styleUrls: ['../edit-word.component.css']
})

export class JazykDetailFormFrComponent extends JazykDetailForm implements OnInit {
  genera: string[];
  constructor (
    formBuilder: FormBuilder,
    errorService: ErrorService,
    jazykService: JazykService
  ) {
    super(formBuilder, errorService, jazykService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  buildForm() {
    let control: FormControl;
    super.buildForm();

    this.genera = this.config.genera;
    if (this.detail.wordTpe === 'noun') {
      control = new FormControl(this.detail.genus, Validators.required);
      this.detailForm.addControl('genus', control);
    }
  }

  postProcessFormData(formData: any): WordDetail {
    console.log('post processing fr');
    const newData: WordDetail = super.copyDetail(formData);
    if (formData.genus) {
      newData.genus = formData.genus;
    }

    return newData;
  }
}
