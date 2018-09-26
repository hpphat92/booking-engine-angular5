import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../shared/api';
import 'leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant';
import { latLng, marker, icon } from 'leaflet';
import * as _ from 'lodash';

@Component({
  selector: 'app-booking-confirmed',
  templateUrl: './booking-confirmed.component.html',
  styleUrls: ['./booking-confirmed.component.scss']
})
export class BookingConfirmedComponent {

  public bookingInfo;
  public bookingDetail;
  public search;

  constructor(public authService: AuthService,
              public router: Router,
              public route: ActivatedRoute,
              public elementRef: ElementRef,
              public bookingService: BookingService) {
    this.bookingInfo = this.authService.bookingInfo;
    this.search = this.authService.search;
    this.bookingDetail = {
      discount: 0,
      list: _.map(_.groupBy(this.bookingInfo.items, (x) => x.rateName + '_' + x.rateValue), (roomList, k) => {
        let [roomName, rateValue] = k.split('_');
        return {
          ratePerItem: rateValue,
          roomName,
          amount: roomList.length,
          list: roomList,
          totalRates: rateValue * roomList.length
        };
      })
    };
    this.bookingDetail.total = _.reduce(this.bookingDetail.list, (a, v) => {
      return a + v.totalRates;
    }, 0) - this.bookingDetail.discount;
    this.bookingDetail.vat = this.bookingDetail.total / 10;
    this.bookingDetail.totalAfterVat = this.bookingDetail.total + this.bookingDetail.vat;
  }

  public manageBooking() {
    this.authService.navigateByUrl('search', 'manage-booking');
  }
}
