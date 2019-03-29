import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'tour-guide-home',
  templateUrl: './tour-guide-home.component.html'
})
export class TourGuideHomeComponent {

  tourguideResources: any;
  public subscription: any;

  shortSelfDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  images: any;
  affiliationsRecognitions: any;
  languages: any;
  specializations: any;

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
      this.shortSelfDescription = this.tourguideResources.seftDescription;
      this.aboutTitle = this.tourguideResources.aboutTitle;
      this.aboutDescription = this.tourguideResources.aboutDescription;
      this.languages = JSON.parse(this.tourguideResources.languages);
      this.specializations = JSON.parse(this.tourguideResources.specializations);
      this.images = JSON.parse(this.tourguideResources.images);
      this.affiliationsRecognitions = JSON.parse(this.tourguideResources.affiliationsRecognition);
    }
  }
}
