import { Component } from '@angular/core';

@Component({
  selector: 'tour-guide',
  templateUrl: './tour-guide.component.html',
  styleUrls: ['./tour-guide.component.scss']
})
export class TourGuideComponent {
  email: string;
  number: string;

  constructor() {
    this.email = "selina@trabble.co";
    this.number = "+65 3688 8888";
  }
}
