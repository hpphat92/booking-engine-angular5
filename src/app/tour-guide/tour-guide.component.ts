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
  name: string;
  avatar: string;

  constructor(public authService: AuthService) {
    this.tourguideResources = this.authService.tourguideResources;
    this.setTourGuideResources();
    this.subscription = this.authService.tourguideResource$.subscribe((newTourGuideResources) => {
      this.tourguideResources = newTourGuideResources;
      this.setTourGuideResources();
    });
  }

  setTourGuideResources() {
    if (this.tourguideResources) {
      this.email = this.tourguideResources.email;
      this.number = this.tourguideResources.phone;
      this.name = this.tourguideResources.name ? this.tourguideResources.name : this.tourguideResources.aliasName;
      this.avatar = this.tourguideResources.avatar;
    }
  }
}
