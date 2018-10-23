import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { BookingService, PartnerService, PartnerSettingService } from '../shared/api';
import * as _ from 'lodash';
import { SettingKeyMap } from '../app.constant';
import { AppMainService } from '../app.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnDestroy {
  public status = false;
  public msg = '';
  public subscription;

  constructor(public router: Router,
              public route: ActivatedRoute,
              public location: Location,
              public bookingService: BookingService,
              public authService: AuthService) {
    this.subscription = this.router.events
      .filter(e => e instanceof NavigationEnd)
      .subscribe((e: any) => {
        if (e.url.includes('payment-success')) {
          let param = this.route.snapshot.queryParams;
          let { paymentId, token, PayerID, success } = param;
          if (!_.compact([paymentId, token, PayerID, success]).length) {
            return;
          }
          if (('' + success).toLowerCase() === 'true' && (!paymentId || !PayerID)) {
            this.status = true;
            this.msg = 'Your payment has been completed';
            return;
          }
          this.approvePayment(paymentId, PayerID);
          this.location.replaceState(this.location.path().split('?')[0], '');
        }
      });
  }

  public approvePayment(paymentId, payerId) {
    this.bookingService.bookingApprovePaypal({
      payerId,
      paymentId
    }).subscribe(() => {
      this.msg = 'Your payment has been completed';
      this.status = true;
    }, (err) => {
      this.msg = err.error ? err.error.message : 'Something went wrong';
      this.status = true;
    });
  }

  public navigateToHome() {
    this.authService.navigateByUrl('');
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

}
