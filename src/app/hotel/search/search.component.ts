import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';

declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export class SearchComponent implements AfterViewInit {

  title = 'app';
  public form: FormGroup;


  @ViewChild('checkOut')
  public checkOut: DaterangepickerDirective;

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
    if(searchModel.checkIn && searchModel.checkOut){
      searchModel.checkIn = {
        startDate: moment(searchModel.checkIn),
        endDate: moment(searchModel.checkIn).add(1, 'days').add(-1, 'seconds')
      };
      searchModel.checkOut = {
        startDate: moment(searchModel.checkOut),
        endDate: moment(searchModel.checkOut).add(1, 'days').add(-1, 'seconds')
      };
    }
    this.form.patchValue(searchModel);
  }

  ngAfterViewInit(): void {

  }

  search() {
    let model = this.form.getRawValue();
    this.authService.search = {
      checkIn: model.checkIn.startDate.toDate(),
      checkOut: model.checkOut.startDate.toDate(),
      numberOfPax: +model.numberOfPax.adults,
      keyword: model.keyword,
      isTraveliingForWork: model.isTraveliingForWork,
    };
    this.authService.navigateByUrl(['home', 'search']);

  }
}
