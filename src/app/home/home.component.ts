import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as data from './hotel.json';

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
        }, 50)
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
    this.router.navigate(['search']);
  }
}
