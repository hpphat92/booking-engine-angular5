import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../shared/api';
import 'leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant';
import { latLng, marker, icon } from 'leaflet';

@Component({
  selector: 'app-booking-confirmed',
  templateUrl: './booking-confirmed.component.html',
  styleUrls: ['./booking-confirmed.component.scss']
})
export class BookingConfirmedComponent {

  constructor(public authService: AuthService,
              public router: Router,
              public route: ActivatedRoute,
              public elementRef: ElementRef,
              public bookingService: BookingService) {
  }
}
