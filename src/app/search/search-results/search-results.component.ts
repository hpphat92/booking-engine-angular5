import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent {
  public hotelList = [
    {
      name: 'Hotel Gracery Seoul',
      score: 8.3,
      price: 299,
      viewCounts: 4010
    },
    {
      name: 'Hotel Gracery Seoul',
      score: 8.3,
      price: 299,
      viewCounts: 4010
    },
    {
      name: 'Hotel Gracery Seoul',
      score: 8.3,
      price: 299,
      viewCounts: 4010
    },
    {
      name: 'Hotel Gracery Seoul',
      score: 8.3,
      price: 299,
      viewCounts: 4010
    },
    {
      name: 'Hotel Gracery Seoul',
      score: 8.3,
      price: 299,
      viewCounts: 4010
    }
  ];
}
