import { Component } from '@angular/core';

@Component({
  selector: 'tour-guide-home',
  templateUrl: './tour-guide-home.component.html'
})
export class TourGuideHomeComponent {
  shortSelfDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  images: any;
  affiliationsRecognitions: any;
  languages: any;
  specializations: any;

  constructor() {
    this.shortSelfDescription = "Fun, Outgoing and Adventurous! I am actually shy by nature, but I do warm up to people quickly!";
    this.aboutTitle = 'Wherever you are, most welcome';
    this.aboutDescription = '<div>Lorem ipsum dolor sit amet, consectetur adipiscing faucibus sem. Nulla dapibus. sed magna ac, convallis faucibus sem. Nulla at lorem ac arcu mattis dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing' +
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
    this.images = ['../../assets/images/useravatar.jpeg', '../../assets/images/useravatar.jpeg', '../../assets/images/useravatar.jpeg']
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
}
