import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BookingService } from '../../shared/api';
import * as moment from 'moment';
import AppConstant from '../../app.constant';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnDestroy {
  public hotelList: any = [];
  public total = 0;
  public paging = {
    pageIndex: 0,
    pageSize: 10,
  };
  public searchInfo = {
    searching: false,
  }
  public navigationSubscription;
  public storedSearchValue;

  constructor(public authService: AuthService,
              public router: Router,
              public bookingService: BookingService,
              public route: ActivatedRoute) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.storedSearchValue = this.authService.search;
        this.search(this.storedSearchValue).subscribe(() => {
        });
      }
    });
  }


  public search(model) {
    this.searchInfo.searching = true;
    return this.bookingService.bookingSearchAvailabilities(
      moment(model.checkIn).format(AppConstant.typeFormat.date),
      moment(model.checkOut).format(AppConstant.typeFormat.date),
      model.numberOfPax,
      '',
      '0',
      true,
      this.paging.pageIndex + 1,
      this.paging.pageSize
    )
      .map((resp: any) => {
        this.searchInfo.searching = false;
        this.total = resp.data.length;
        this.hotelList = resp.data;
        return resp.data.entities;
      }, () => {
      });
  }

  public goDetail(hotel) {
    this.authService.hotelDetail = hotel;
    this.router.navigate(['/search/detail/' + hotel.id]);
  }

  public toggleHotelExpanding(hotel) {
    hotel.isExpanding = !hotel.isExpanding;
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
