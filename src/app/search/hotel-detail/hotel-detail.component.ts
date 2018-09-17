import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../shared/api';
import * as iconUrl from 'leaflet/dist/images/marker-icon.png';
import * as shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as L from 'leaflet';
import { latLng , marker, icon} from 'leaflet';
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
  public newMarker;
  public layers: any = [];
  public options = {
    // layers: [
    //   tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    // ],
    zoom: 12,
    center: latLng(46.879966, -121.726909)
  };
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
  public hotelList = [
    {
      'photo': 'https://www.berjayahotel.com/sites/default/files/colombo_1-1.jpg',
      'name': 'Berjaya Hotel',
      'description': 'from $678/night'
    },
    {
      'photo': 'https://q-ec.bstatic.com/images/hotel/max1280x900/468/46871800.jpg',
      'name': 'Hotel Cezar Banja Luka',
      'description': 'from $678/night'
    },
    {
      'photo': 'https://r-ec.bstatic.com/images/hotel/max1280x900/154/154044188.jpg',
      'name': 'President Sarajevo',
      'description': 'from $678/night'
    },
    {
      'photo': 'https://q-ec.bstatic.com/data/landmark/840x460/307/30764.jpg',
      'name': 'Hotel Cezar',
      'description': 'from $678/night'
    },
  ]

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

  mapReady(map) {
    (L.gridLayer as any).googleMutant({
      maxZoom: 24,
      type: 'roadmap'
    }).addTo(map);
    map.panTo(this.hotel.location);
    map.addLayer(this.createMarker(this.hotel.location));
  }
  public createMarker({ lat, lng }) {
    this.newMarker = marker([lat, lng],
      {
        icon: icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: iconUrl,
          shadowUrl: shadowUrl
        }),
        draggable: false
      });
    this.layers.push(this.newMarker);
    this.newMarker.on('dragend', () => {
      let { lat: latitude, lng: longitude } = this.newMarker.getLatLng();
    });
    return this.newMarker;
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
      this.hotel.location = latLng(this.hotel.latitude, this.hotel.longitude);
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
  public onTabChange(e) {
    let { index } = e;
    window.dispatchEvent(new Event('resize'));
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
