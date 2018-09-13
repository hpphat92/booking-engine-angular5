import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../shared/api';
import * as moment from 'moment';
import * as _ from 'lodash';
import AppConstant from '../../app.constant';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent {
  public subscription;
  public hotelId;
  public hotel: any = null;
  public totalRates;
  public roomList = [];
  public carouselPhoto = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 1000,
    point: {
      visible: false
    },
    load: 2,
    touch: true,
    loop: false,
    custom: 'banner'
  };

  constructor(public authService: AuthService,
              public router: Router,
              public route: ActivatedRoute,
              public elementRef: ElementRef,
              public bookingService: BookingService) {
    // this.numberOfSelectAmounts = _.times(this.userSearch.numberOfPAX, x => x + 1);
    this.subscription = this.route.params.subscribe(({ id }) => {
      this.hotelId = id;
      this.getPropertyDetail(id)
        .subscribe();
    });
  }

  public getPropertyDetail(id) {
    let modelSearch = this.authService.search;
    return this.bookingService.bookingDetailProperty(
      this.hotelId,
      moment(modelSearch.checkIn).format(AppConstant.typeFormat.date),
      moment(modelSearch.checkOut).format(AppConstant.typeFormat.date),
    ).map((resp) => {
      let data: any = resp.data;
      this.hotel = data;
      _.forEach(this.hotel.rooms, (room) => {
        room.rateList = _.flatten(_.map(room.rateTypes, (rate) => {
          let groupRates = _.groupBy(rate.items, 'rate');
          return _.map(_.toPairs(groupRates), ([rateValue, items]) => {
            let listItemIds = _.map(items, 'id');
            let options = _.reduce(listItemIds, (acc, currentId) => {
              let lastItem = acc.slice(-1)[0] || [];
              acc.push([...lastItem, currentId]);
              return acc;
            }, []);
            return {
              tempId: `${rate.id}_${rateValue}`,
              rate,
              rateValue: +rateValue,
              options: options,
              allItems: listItemIds
            };
          });
        }));
      });
    });
  }

  public extractListSelectedItems(room) {
    let selectedIds = _.flatten(_.map(room.rateList, 'selectedItemIds'));
    _.forEach(room.rateList, (rl) => {
      let selectedItems = rl.selectedItemIds || [];
      let allItems = rl.allItems;
      let listItemIds = [..._.without(allItems, ...selectedIds), ...selectedItems];
      rl.options = _.reduce(listItemIds, (acc, currentId) => {
        let lastItem = acc.slice(-1)[0] || [];
        acc.push([...lastItem, currentId]);
        return acc;
      }, []);
    });
    // let newRateList = _.flatten(_.map(room.rateTypes, (rate) => {
    //   let groupRates = _.groupBy(rate.items, 'rate');
    //   return _.map(_.toPairs(groupRates), ([rateValue, items]) => {
    //     let listItemIds = _.map(items, 'id');
    //     // _.remove(listItemIds, (i) => selectedIds.indexOf(i) > -1);
    //     return {
    //       tempId: `${rate.id}_${rateValue}`,
    //       rate,
    //       rateValue: +rateValue,
    //       options: _.reduce(listItemIds, (acc, currentId) => {
    //         let lastItem = acc.slice(-1)[0] || [];
    //         acc.push([...lastItem, currentId]);
    //         return acc;
    //       }, [])
    //     };
    //   });
    // }));
    // _.forEach(newRateList, (rl) => {
    //   let findingRl = _.find(room.rateList, { tempId: rl.tempId });
    //   if (findingRl) {
    //
    //     findingRl = {
    //       ...findingRl,
    //       ...rl,
    //
    //     }
    //     _.extend(findingRl, rl);
    //   }
    // })
  }
}
