import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import AppConstant from '../app.constant';
import { AuthService } from '../shared/services/auth.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export class SearchComponent implements AfterViewInit {

  title = 'app';
  public form: FormGroup;

  constructor(public formBuilder: FormBuilder,
              public router: Router,
              public authService: AuthService) {
    this.form = this.formBuilder.group({
      keyword: [''],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      numberOfPax: [''],
    });
    let searchModel = this.authService.search;
    searchModel.checkIn = {
      startDate: moment(searchModel.checkIn),
      endDate: moment(searchModel.checkIn).add(1, 'days').add(-1, 'seconds')
    };
    searchModel.checkOut = {
      startDate: moment(searchModel.checkOut),
      endDate: moment(searchModel.checkOut).add(1, 'days').add(-1, 'seconds')
    };
    this.form.patchValue(searchModel);
  }

  ngAfterViewInit(): void {

  }

  search() {
    let model = this.form.getRawValue();
    this.authService.search = {
      checkIn: model.checkIn.startDate.toDate(),
      checkOut: model.checkOut.startDate.toDate(),
      numberOfPax: 1 || model.numberOfPax,
      keyword: model.keyword,
      isTraveliingForWork: model.isTraveliingForWork,
    };
    this.authService.navigateByUrl('search');
  }
}
