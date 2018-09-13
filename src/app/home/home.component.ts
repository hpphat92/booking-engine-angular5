import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as data from './hotel.json';
import * as _ from 'lodash';
import { AuthService } from '../shared/services/auth.service';
import AppConstant from '../app.constant';

console.log(data);
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  title = 'app';
  public form: FormGroup;
  public hotelList = data;

  constructor(public formBuilder: FormBuilder,
              public authService: AuthService,
              public route: ActivatedRoute,
              public router: Router) {
    this.form = this.formBuilder.group({
      keyword: [''],
      checkInCheckOut: ['', Validators.required],
      numberOfPax: [''],
      isTraveliingForWork: ['']
    });
  }

  ngAfterViewInit(): void {
    $('.cover-photos').slick({
      dots: true,
      infinite: true,
      speed: 500,
      autoplay: true,
      arrows: false,
      autoplaySpeed: 3000,
      fade: true,
      cssEase: 'linear',
      appendDots: $('.dot-slider')
    });
    $('.tabs li').on('click', function () {
      const currentEl = $(this);
      const width = $(this).outerWidth();
      const thisLeft = $(this).offset().left;
      const currentLeft = (thisLeft - $(this.parentElement).offset().left + width);
      const parentWidth = $(this.parentElement).width();
      let scrollvalue = 0;
      if (parentWidth < currentLeft) {
        scrollvalue = currentLeft - parentWidth + width / 2;
        $(this.parentElement).animate({
          scrollLeft: currentLeft
        }, 50);
      }
      if (currentLeft < width) {
        scrollvalue = 0;
        $(this.parentElement).animate({
          scrollLeft: 0
        }, 50);
      }
      $('.tabs li.active').removeClass('active');
      currentEl.addClass('active');
    });
  }

  public search() {
    const model = this.form.getRawValue();
    this.authService.search = {
      checkIn: model.checkInCheckOut.checkIn.toDate(),
      checkOut: model.checkInCheckOut.checkOut.startOf('day').toDate(),
      numberOfPax: model.numberOfPax,
      keyword: model.keyword,
      isTraveliingForWork: model.isTraveliingForWork,
    };
    this.authService.navigateByUrl('search');
  }
}
