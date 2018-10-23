import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { AuthService } from '../shared/services/auth.service';

import { AppMainService } from '../app.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  title = 'app';

  public currentActive = 0;
  public form: FormGroup;
  private _siteResources: any;
  public subscription: any;
  public properties = {
    cities: [],
    hotelList: [],
    properties: []
  };
  public mapSearch;
  public inventoryTypes;
  public selected;
  public subscriptionGetInventory;

  // public properties = data;

  public set siteResources(val) {
    this._siteResources = val;
    if (this._siteResources) {
      this.subscriptionGetInventory && this.subscriptionGetInventory.unsubscribe();
      this.subscriptionGetInventory = this.getInventoryTypes().subscribe((resp: any) => {
        this.inventoryTypes = resp.data;
        this.loadProperties(this._siteResources.fromPartnerId);
      });

    }
  }

  public get siteResources() {
    return this._siteResources;
  }

  constructor(public formBuilder: FormBuilder,
              public authService: AuthService,
              public appMainService: AppMainService,
              public route: ActivatedRoute,
              public router: Router) {
    this.form = this.formBuilder.group({
      keyword: [''],
      checkInCheckOut: ['', Validators.required],
      numberOfPax: [''],
      isTraveliingForWork: ['']
    });
    this.siteResources = this.authService.siteResources;
    this.authService.search = {};
    this.subscription = this.authService.siteResource$.subscribe((newSiteResource) => {
      this.siteResources = null;
      setTimeout(() => {
        this.siteResources = newSiteResource;
        this.addSlick();
      });
    });
  }

  addSlick() {
    setTimeout(() => {
      if ($('.cover-photos')[0] && $('.cover-photos')[0].slick) {
        $('.cover-photos').slick('unslick');
      }
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
    });
  }

  ngAfterViewInit(): void {
    this.addSlick();
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
    this.initSearch();
  }

  public search() {
    const model = this.form.getRawValue();
    this.authService.search = {
      checkIn: model.checkInCheckOut.checkIn.toDate(),
      checkOut: model.checkInCheckOut.checkOut.startOf('day').toDate(),
      numberOfPax: 1 || model.numberOfPax,
      keyword: model.keyword,
      isTraveliingForWork: model.isTraveliingForWork,
      typeId: this.inventoryTypes[this.currentActive] ? this.inventoryTypes[this.currentActive].id : '',
    };
    this.authService.navigateByUrl('search');
  }

  public getInventoryTypes() {
    return this.appMainService.searchInventoryTypes();
  }

  public loadProperties(partnerId) {
    this.appMainService.searchProperties(partnerId || '')
      .subscribe((resp: any) => {
        this.processData(partnerId, resp.data);
      });
  }

  public processData(partnerId, data) {
    // group by city
    this.properties.hotelList = data;
    if (this.properties.hotelList.length === 1) {
      this.appMainService.searchProperties(partnerId, this.properties.hotelList[0].id)
        .subscribe((resp: any) => {
          this.properties.properties = _.filter(_.map(_.toPairs(_.groupBy(resp.data, 'type.name')), ([type, properties]) => {
            return { type, properties };
          }), (x) => {
            return x.properties.length;
          })
        });
    } else {
      this.properties.cities = _.map(_.toPairs(_.groupBy(data, (c) => c.city || c.country)), ([cityName, listProperties]) => {
        return {
          name: cityName,
          properties: _.filter(_.map(_.toPairs(_.groupBy(listProperties, 'type.name')), ([type, properties]) => {
            return { type, properties };
          }), (x) => {
            return x.properties.length;
          })
        };
      });
      _.forEach(this.properties.cities, (city) => {
        this.getCityDetail(city.name).then((resp) => {
          city.image = resp;
        });
      });
    }
  }


  public cleanAccents(str: string): string {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    // Combining Diacritical Marks
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
    str = str.replace(/\u02C6|\u0306|\u031B/g, '');
    return str;
  }

  public getCityDetail(cityName) {
    return new Promise((resolve, reject) => {
      this.mapSearch.findPlaceFromQuery({
        query: this.cleanAccents(cityName.toLowerCase()),
        fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry', 'types']
      }, (result, status) => {
        if (status === 'OK') {
          let photos = result[0].photos;
          if (photos && photos.length) {
            resolve(photos[0].getUrl());
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      });
    });
  }

  public goDetail(hotel) {
    this.authService.hotelDetail = hotel;
    this.authService.navigateByUrl(['search', 'detail', hotel.id]);
  }

  public initSearch() {
    this.mapSearch = new (window as any).google.maps.places.PlacesService($('#map-temp')[0]);
    // const request = {
    //   query: 'Goa',
    //   fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
    // };
    // mapSearch.findPlaceFromQuery(request, () => {
    //   debugger;
    // });
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }
}
