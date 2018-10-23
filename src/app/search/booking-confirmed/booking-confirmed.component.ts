import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BookingService } from '../../shared/api';
import 'leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant';
import { latLng, marker, icon } from 'leaflet';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-booking-confirmed',
  templateUrl: './booking-confirmed.component.html',
  styleUrls: ['./booking-confirmed.component.scss']
})
export class BookingConfirmedComponent {

  public bookingInfo;
  public bookingDetail;
  public success = false;
  public msg = '';
  public subscription;
  public search;

  constructor(public authService: AuthService,
              public router: Router,
              public route: ActivatedRoute,
              public location: Location,
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
    this.subscription = this.router.events
      .filter(e => e instanceof NavigationEnd)
      .subscribe((e: any) => {
        if (e.url.includes('booking-completed')) {
          let param = this.route.snapshot.queryParams;
          let { paymentId, token, PayerID, bookingId } = param;
          if (!_.compact([paymentId, token, PayerID, bookingId]).length) {
            return;
          }
          if (bookingId && (!paymentId || !PayerID)) {
            this.loadBookingDetail(bookingId);
            return;
          }
          this.approvePayment(paymentId, PayerID);
          this.location.replaceState(this.location.path().split('?')[0], '');
        }
      });
  }


  public loadBookingDetail(bookingId) {
    this.bookingService.bookingGet(bookingId)
      .subscribe((r) => {
        this.bindHotelDetailData(r.data);
      })
  }


  public bindHotelDetailData(bookingData) {
    this.search = {
      checkIn: moment(bookingData.checkInDate).toDate(),
      checkOut: moment(bookingData.checkOutDate).toDate(),
      hotel: bookingData.property,
    };
    this.bookingDetail = {
      ...bookingData,
      discount: 0,
      list: _.flatten(_.map(bookingData.items, (i) => {
        return _.map(i.types, (t) => {
          let roomList = _.filter(bookingData.items, (fItem) => {
            return _.find(fItem.types, {
              name: t.name,
              rate: t.rate
            })
          });
          return {
            ratePerItem: t.rate,
            roomName: i.name,
            amount: t.quantity,
            list: roomList,
            totalRates: t.rate * roomList.length
          };
        });
      }))
    };
    this.bookingDetail.total = _.reduce(this.bookingDetail.list, (a, v) => {
      return a + v.totalRates;
    }, 0) - this.bookingDetail.discount;
    this.bookingDetail.vat = this.bookingDetail.total / 10;
    this.bookingDetail.totalAfterVat = this.bookingDetail.total + this.bookingDetail.vat;
  }

  public approvePayment(paymentId, payerId) {
    this.bookingService.bookingApprovePaypal({
      payerId,
      paymentId
    }).subscribe((r: any) => {
      this.bindHotelDetailData(r.data);
    }, (err) => {
      this.msg = err.error ? err.error.message : 'Something went wrong';
      this.success = false;
    });
  }

  public manageBooking() {
    this.authService.navigateByUrl('search', 'manage-booking');
  }
}
