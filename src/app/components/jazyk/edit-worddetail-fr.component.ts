import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';
import {JazykService} from '../../services/jazyk.service';
import {ErrorService} from '../../services/error.service';
import {JazykDetailForm} from './edit-worddetail.component';
import {WordDetail} from '../../models/jazyk.model';

@Component({
  selector: 'km-detail-form-fr',
  templateUrl: 'edit-worddetail-fr.component.html',
  styleUrls: ['edit-word.component.css']
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

    super.buildForm();
    /*
    this.detail = detail ? detail : this.getNewDetail();
    this.genera = this.config.genera;

    this.detailForm = this.formBuilder.group({
      '_id': [detail._id],
      'docTpe': [detail.docTpe, [Validators.required]],
      'wordTpe': [detail.wordTpe, [Validators.required]],
      'lan': [detail.lan, [Validators.required]],
      'word': [detail.word, [Validators.required]],
      'genus': [detail.genus, detail.wordTpe === 'noun' ? [Validators.required] : []]
    });
    */
  }

  updateDetail(formdetail: any) {
    const worddetail = this.postProcessFormData(formdetail);
    super.updateWordDetail(worddetail);
  }

  addDetail(formdetail: any) {
    const worddetail = this.postProcessFormData(formdetail);
    super.addWordDetail(worddetail);
  }

  postProcessFormData(data: any): WordDetail {
    console.log('post processing fr');
    const newData: WordDetail = super.copyDetail(data);
    if (data.genus) {
      newData.genus = data.genus;
    }

    return newData;
  }
}
