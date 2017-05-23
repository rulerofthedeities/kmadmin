import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../../services/jazyk.service';
import {ErrorService} from '../../../services/error.service';
import {WordDetail} from '../../../models/jazyk.model';
import {JazykDetailForm} from '../worddetail/edit-worddetail.component';

@Component({
  selector: 'km-detail-form-cs',
  templateUrl: 'edit-worddetail-cs.component.html',
  styleUrls: ['../edit-word.component.css']
})

export class JazykDetailFormCsComponent extends JazykDetailForm implements OnInit {
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
    console.log('post processing cs');
    const newData: WordDetail = super.copyDetail(formData);

    return newData;
  }
}
