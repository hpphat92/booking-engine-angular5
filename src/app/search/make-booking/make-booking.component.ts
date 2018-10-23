import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService, InventoryBooking, ReserveModel } from '../../shared/api';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AppConstant} from '../../app.constant';
import { MatDialog, MatTabGroup } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import BookingSourceEnum = InventoryBooking.BookingSourceEnum;
import PaymentMethodEnum = ReserveModel.PaymentMethodEnum;

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

  public createBooking(paymentMethod?) {
    let { bookingInfo, search } = this.authService;
    let userInfo = this.userInfoForm.getRawValue();
    return this.bookingService.bookingReserve(bookingInfo.hotel.id, {
      checkIn: moment(search.checkIn).format(AppConstant.typeFormat.date),
      checkOut: moment(search.checkOut).format(AppConstant.typeFormat.date),
      bookingSource: BookingSourceEnum.Manual,
      remarks: userInfo.remarks,
      paymentMethod: paymentMethod || PaymentMethodEnum.Cash,
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

  public doCreateBooking() {
    this.createBooking().subscribe(() => {
      this.authService.navigateByUrl(['search', 'booking-completed']);
    })
  }

  public payWithStripe() {
    this.createBooking(PaymentMethodEnum.CreditCard).subscribe((resp: any) => {
      this.bookingService.bookingCreateStripe(resp.data.id)
        .subscribe((r) => {
          var handler = StripeCheckout.configure({
            key: r.data.stripePublishKey,
            image: 'https://trabbleteststorage.blob.core.windows.net/mycontainer/trabble_31cd3b5aa31147ceae4c7d8d25f87258.png',
            locale: 'auto',
            token: (token) => {
              let person = {
                email: token.email,
                tokenId: token.id,
                bookingId: resp.data.id
              };
              this.bookingService.bookingApproveStripe(person)
                .subscribe(() => {
                  this.router.navigate(['booking-completed'], {
                    queryParams: {
                      bookingId: resp.data.id
                    }
                  });
                });
            }
          });

          // Open Checkout with further options:
          handler.open({
            name: 'Trabble',
            description: 'Payment by stripe',
            amount: r.data.amount,
            currency: r.data.currency,
          });
        });
    });
    // this.doCreateBooking();
  }

  public payWithPaypal() {
    this.createBooking(PaymentMethodEnum.Paypal).subscribe((resp: any) => {
      this.bookingService.bookingCreatePaypal(resp.data.id)
        .subscribe((r) => {
          location.replace(r.data);
        });
    });
  }
}
