import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BookingService} from '../../../shared/api';
import * as _ from 'lodash';
import * as moment from 'moment';
import {AppConstant} from '../../../app.constant';
import {ModalHotelViewingDetailComponent} from '../modal-hotel-viewing-detail/modal-hotel-viewing-detail.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnDestroy {
  public resultList: any = [];
  public total = 0;
  public paging = {
    pageIndex: 0,
    pageSize: 10
  };
  public searchInfo = {
    searching: false
  };
  public navigationSubscription;
  public storedSearchValue;

  constructor(public authService: AuthService,
              public router: Router,
              public dialog: MatDialog,
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
      this.authService.siteResources.fromPartnerId,
      model.typeId,
      '0',
      true,
      this.paging.pageIndex + 1,
      this.paging.pageSize
    )
      .map((resp: any) => {
        this.searchInfo.searching = false;
        this.total = resp.data.length;
        this.resultList = _.map(_.toPairs(_.groupBy(resp.data, 'type')), ([type, list]) => {
          return {
            type,
            list
          };
        });

        return resp.data.entities;
      }, () => {
      });
  }

  public goDetail(hotel) {
    this.authService.hotelDetail = hotel;
    this.authService.navigateByUrl(['home', 'search', 'detail', hotel.id]);
  }

  public viewHotelDetail(hotel) {
    this.authService.hotelDetail = hotel;
    this.authService.navigateByUrl(['home', 'search', 'detail', hotel.id]);
    // const dialogRef = this.dialog.open(ModalHotelViewingDetailComponent, {
    //   data: {
    //     hotel
    //   },
    //   width: '50vw',
    //   height: '60vh'
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {
    // });
  }


  public getHotelFullInfo(hotel) {
    if (hotel.roomData) {
      return;
    }
    let modelSearch = this.authService.search;
    hotel.roomData = {};
    this.bookingService.bookingDetailProperty(
      hotel.id,
      moment(modelSearch.checkIn).format(AppConstant.typeFormat.date),
      moment(modelSearch.checkOut).format(AppConstant.typeFormat.date)
    ).subscribe((resp) => {
      let data: any = resp.data;
      hotel.rooms = _.flatten(_.map(data.rooms, (room) => {
        return _.flatten(_.map(room.rateTypes, (rate) => {
          let groupRates = _.groupBy(rate.items, 'rate');
          return _.map(_.toPairs(groupRates), ([rateValue, items]) => {
            return {
              rate,
              rateValue: +rateValue
            };
          });
        }));
      }));
    });
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
