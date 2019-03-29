import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'tour-guide',
  templateUrl: './tour-guide.component.html',
  styleUrls: ['./tour-guide.component.scss']
})
export class TourGuideComponent {
  tourguideResources: any;
  subscription: any;

  email: string;
  number: string;

  constructor(public authService: AuthService) {
    this.subscription = this.authService.tourguideResource$.subscribe((newTourGuideResources) => {
      this.tourguideResources = newTourGuideResources;
      this.setTourGuideResources();
    });
  }

  setTourGuideResources() {
    if (this.tourguideResources) {
      this.email = this.tourguideResources.email;
      this.number = this.tourguideResources.phone;
    }
  }
}
