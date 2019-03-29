import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { AuthService } from '../../shared/services/auth.service';
@Component({
  selector: 'tour-guide-home',
  templateUrl: './tour-guide-home.component.html'
})
export class TourGuideHomeComponent implements OnInit {
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
    this.tourguideResources = this.authService.tourguideResources;
    this.setTourGuideResources();
    this.subscription = this.authService.tourguideResource$.subscribe((newTourGuideResources) => {
      this.tourguideResources = newTourGuideResources;
      this.setTourGuideResources();
    });
    this.shortSelfDescription = 'Fun, Outgoing and Adventurous! I am actually shy by nature, but I do warm up to people quickly!';
    this.aboutTitle = 'Wherever you are, most welcome';
    this.aboutDescription = '<div>Lorem ipsum dolor sit amet, consectetur adipiscing faucibus sem. Nulla dapibus. sed magna ac,' +
      ' convallis faucibus sem. Nulla at lorem ac arcu mattis dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing' +
      'faucibus sem. Nulla dapibus. sed magna ac, convallis faucibus sem. Nulla at lorem ac arcu mattis' +
      'dapibus.</div>' +
      '<br>' +
      '<div>Lorem ipsum dolor sit amet, consectetur adipiscing faucibus sem. Nulla dapibus. sed magna ac, convallis' +
      'faucibus sem. Nulla at lorem ac arcu mattis dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing' +
      'faucibus sem. Nulla dapibus. sed magna ac, convallis faucibus sem. Nulla at lorem ac arcu mattis' +
      'dapibus.</div>' +
      '<br>' +
      '<div>Lorem ipsum dolor sit amet, consectetur adipiscing faucibus sem. Nulla dapibus. sed magna ac, convallis' +
      'faucibus sem. Nulla at lorem ac arcu mattis dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing' +
      'faucibus sem. Nulla dapibus. sed magna ac, convallis faucibus sem. Nulla at lorem ac arcu mattis' +
      'dapibus.</div>';
    this.languages = ['English', 'Mandarin', 'Japanese', 'Indonesian'];
    this.specializations = ['Food & Beverage', 'Historical & Cultural', 'Outdoor & Sightseeing'];
    this.images = ['../../assets/images/useravatar.jpeg', '../../assets/images/useravatar.jpeg', '../../assets/images/useravatar.jpeg'];
    this.affiliationsRecognitions = [
      {
        image: '../../assets/images/useravatar.jpeg',
        title: 'Selina Gorson',
        shortDescription: 'Joined 5 years'
      },
      {
        image: '../../assets/images/useravatar.jpeg',
        title: 'Selina Gorson',
        shortDescription: 'Joined 5 years'
      },
      {
        image: '../../assets/images/useravatar.jpeg',
        title: 'Selina Gorson',
        shortDescription: 'Joined 5 years'
      },
      {
        image: '../../assets/images/useravatar.jpeg',
        title: 'Selina Gorson',
        shortDescription: 'Joined 5 years'
      },
      {
        image: '../../assets/images/useravatar.jpeg',
        title: 'Selina Gorson',
        shortDescription: 'Joined 5 years'
      },
      {
        image: '../../assets/images/useravatar.jpeg',
        title: 'Selina Gorson',
        shortDescription: 'Joined 5 years'
      },
    ];
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
  ngOnInit() {
    this.galleryOptions = [
      { 'image': false, 'thumbnailsRemainingCount': true, 'height': '410px', 'width': '100%', 'thumbnailsColumns': 3 },
      { 'breakpoint': 500, 'width': '100%', 'thumbnailsColumns': 1 }
    ];
    this.galleryImages = [
      {
        small: '../../assets/images/useravatar.jpeg',
        medium: '../../assets/images/useravatar.jpeg',
        big: '../../assets/images/useravatar.jpeg'
      },
      {
        small: '../../assets/images/useravatar.jpeg',
        medium: '../../assets/images/useravatar.jpeg',
        big: '../../assets/images/useravatar.jpeg'
      },
      {
        small: '../../assets/images/useravatar.jpeg',
        medium: '../../assets/images/useravatar.jpeg',
        big: '../../assets/images/useravatar.jpeg'
      },
      {
        small: '../../assets/images/useravatar.jpeg',
        medium: '../../assets/images/useravatar.jpeg',
        big: '../../assets/images/useravatar.jpeg'
      },
      {
        small: '../../assets/images/useravatar.jpeg',
        medium: '../../assets/images/useravatar.jpeg',
        big: '../../assets/images/useravatar.jpeg'
      },
      {
        small: '../../assets/images/useravatar.jpeg',
        medium: '../../assets/images/useravatar.jpeg',
        big: '../../assets/images/useravatar.jpeg'
      }
    ];
  }
}
