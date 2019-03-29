import { Component } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
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
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(public authService: AuthService) {
    this.galleryOptions = [
      { 'image': false, 'thumbnailsRemainingCount': true, 'height': '410px', 'width': '100%', 'thumbnailsColumns': 3 },
      { 'breakpoint': 500, 'width': '100%', 'thumbnailsColumns': 1 }
    ];
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

      this.galleryImages = this.images.map((obj) => {
        return {
          small: obj,
          medium: obj,
          big: obj
        }
      })
    }
  }
}
