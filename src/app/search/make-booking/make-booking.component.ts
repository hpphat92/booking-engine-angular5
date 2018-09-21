import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BookingService, InventoryBooking } from '../../shared/api';
import * as _ from 'lodash';
import * as moment from 'moment';
import AppConstant from '../../app.constant';
import { ModalHotelViewingDetailComponent } from '../modal-hotel-viewing-detail/modal-hotel-viewing-detail.component';
import { MatDialog, MatTabGroup } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import BookingSourceEnum = InventoryBooking.BookingSourceEnum;

@Component({
  selector: 'app-make-booking',
  templateUrl: './make-booking.component.html',
  styleUrls: ['./make-booking.component.scss']
})
export class MakeBookingComponent implements OnDestroy {

  public userInfoForm: FormGroup;
  public bookingInfo;
  public selectedIndex = 0;
  public bookingDetail: any = {};
  public search;


  @ViewChild('matTab')
  public matTab: MatTabGroup;
  public userInfoFormErrors = {
    titleName: {},
    travellingForWork: {},
    isMainGuest: {},
    firstName: {},
    lastName: {},
    email: {},
    firstAddress: {},
    secondAddress: {},
    confirmEmail: {},
    nationality: {},
    phoneNumber: {},
    cardNumber: {},
    cardType: {},
    expiringMonth: {},
    expiringYear: {},
    birthday: {},
    gender: {},
    passportNumber: {},
    postalCode: {},
  };

  constructor(public authService: AuthService,
              public router: Router,
              public fb: FormBuilder,
              public dialog: MatDialog,
              public bookingService: BookingService,
              public route: ActivatedRoute) {
    this.bookingInfo = this.authService.bookingInfo;
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
    this.search = this.authService.search;
    this.userInfoForm = this.fb.group({
      titleName: ['Mr.', [Validators.required]],
      travellingForWork: [true, [Validators.required]],
      isMainGuest: [true, [Validators.required]],
      firstName: [''],
      remarks: [''],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      nationality: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: ['Male', [Validators.required]],
      passportNumber: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      firstAddress: [''],
      secondAddress: [''],
      cardNumber: [''],
      cardType: ['Visa'],
      expiringMonth: [''],
      expiringYear: [''],
    });
    if (this.bookingInfo.user) {
      this.userInfoForm.patchValue(this.bookingInfo.user);
    }
    this.userInfoForm.valueChanges.subscribe(() => {
      this.onUserInfoFormValuesChanged();
    });
  }

  public onUserInfoFormValuesChanged() {
    for (const field in this.userInfoFormErrors) {
      if (!this.userInfoFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.userInfoFormErrors[field] = {};

      // Get the control
      const control = this.userInfoForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.userInfoFormErrors[field] = control.errors;
      }
    }
  }

  public goBackToSelectRooms() {
    this.authService.navigateByUrl(['search', 'detail', this.bookingInfo.hotel.id]);
  }

  ngOnDestroy() {
  }

  public save() {
    this.authService.bookingInfo = {
      ...this.authService.bookingInfo,
      user: this.userInfoForm.getRawValue()
    };
    this.matTab.selectedIndex = 1;
  }

  public createBooking() {
    let { bookingInfo, search } = this.authService;
    let userInfo = this.userInfoForm.getRawValue();
    return this.bookingService.bookingReserve(bookingInfo.hotel.id, {
      checkIn: moment(search.checkIn).format(AppConstant.typeFormat.date),
      checkOut: moment(search.checkOut).format(AppConstant.typeFormat.date),
      bookingSource: BookingSourceEnum.Manual,
      remarks: userInfo.remarks,
      addOns: [],
      reservationItems: _.map(_.flatten(_.map(this.bookingDetail.list, 'list')), (r) => {
        return {
          rateTypeId: r.rateTypeId,
          itemId: r.itemId
        };
      }),
      // reservationItems: _.flatten(_.map(this.authService.bookingInfo.roomList, (room) => {
      //   return _.map(room.rooms, (itemId) => {
      //     return {
      //       rateTypeId: room.rateType.id,
      //       itemId
      //     }
      //   });
      // })),
      arrivalTime: '',
      user: userInfo
    });
  }

  public payWithStripe() {
    this.createBooking().subscribe(() => {
      this.authService.navigateByUrl(['search', 'booking-completed']);
    })
  }

  public payWithPaypal() {
    this.createBooking().subscribe(() => {
      this.authService.navigateByUrl(['search', 'booking-completed']);
    })
  }
}