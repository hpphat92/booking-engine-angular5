import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../shared/api';
import 'leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant';
import { latLng, marker, icon } from 'leaflet';
import * as _ from 'lodash';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.scss']
})
export class ManageBookingComponent {

  public form;
  public bookingDetails = [];

  constructor(public authService: AuthService,
              public router: Router,
              public bookingService: BookingService,
              public fb: FormBuilder) {
    this.form = this.fb.group({
      bookingId: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      lastName: ['', []],
    });
  }

  public searchBooking() {
    let { bookingId, email, lastName } = this.form.getRawValue();
    this.bookingService.bookingSearch('', '', '', '', bookingId, email)
      .subscribe((resp) => {
        this.bookingDetails = resp.data;
      });
  }

}
