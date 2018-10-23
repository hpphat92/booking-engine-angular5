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
import { latLng, marker, icon } from 'leaflet';
import { AppConstant} from '../../app.constant';
import { AppMainService } from '../../app.service';

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
  public selectedIds: any = [];
  public layers: any = [];
  public options = {
    // layers: [
    //   tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    // ],
    zoom: 12,
    center: latLng(46.879966, -121.726909)
  };
  public reviews = [
    {
      name: 'Stella Yep',
      location: 'Solo Traveller, Malaysia',
      title: 'Excellent service ever',
      reviewScore: 9.2,
      comment: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.'
    },
    {
      name: 'Stella Yep',
      location: 'Solo Traveller, Malaysia',
      title: 'Excellent service ever',
      reviewScore: 9.2,
      comment: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.'
    },
    {
      name: 'Stella Yep',
      location: 'Solo Traveller, Malaysia',
      title: 'Excellent service ever',
      reviewScore: 9.2,
      comment: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.'
    },
    {
      name: 'Stella Yep',
      location: 'Solo Traveller, Malaysia',
      title: 'Excellent service ever',
      reviewScore: 9.2,
      comment: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.'
    }
  ];
  public currentSelectedTab = 0;
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
              public appMainService: AppMainService,
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
    if (modelSearch.checkIn && modelSearch.checkOut) {
      return this.bookingService.bookingDetailProperty(
        this.hotelId,
        moment(modelSearch.checkIn).format(AppConstant.typeFormat.date),
        moment(modelSearch.checkOut).format(AppConstant.typeFormat.date),
        modelSearch.numberOfPax
      ).map((resp) => {
        let data: any = resp.data;
        this.hotel = data;
        this.hotel.location = latLng(this.hotel.latitude, this.hotel.longitude);
        this.authService.bookingInfo = {
          ...this.authService.bookingInfo,
          hotel: data
        };
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
              let tempId = `${rate.id}_${rateValue}`;
              return {
                tempId,
                rate,
                rateValue: +rateValue,
                options: options,
                allItems: listItemIds,
                selectedItemIds: _.map(_.filter(this.authService.bookingInfo.items, { tempId }), 'itemId'),
              };
            });
          }));
          this.extractListSelectedItems(this.hotel, room);
        });
      });
    }
    // Should search detail
    return this.appMainService.getInventoryTemplatesDetail(this.hotelId)
      .map((resp: any) => {
        let data: any = resp.data;
        data.images = _.map(data.images, 'imageUrl');
        this.hotel = data;
        this.hotel.location = latLng(this.hotel.latitude, this.hotel.longitude);
        this.authService.bookingInfo = {
          ...this.authService.bookingInfo,
          hotel: data
        };
        this.appMainService.searchProperties(this.authService.siteResources.fromPartnerId || '', this.hotel.id)
          .subscribe((r: any) => {
            this.hotel.templates = r.data;
          });
      });
  }


  public getHotelImages (){
    return [
      {
        picture: 'https://source.unsplash.com/433x649/?Uruguay'
      },
      {
        picture: 'https://source.unsplash.com/530x572/?Jamaica'
      },
      {
        picture: 'https://source.unsplash.com/531x430/?Kuwait'
      },
      {
        picture: 'https://source.unsplash.com/586x1073/?Bermuda'
      },
      {
        picture: 'https://source.unsplash.com/500x571/?Ecuador'
      },
      {
        picture: 'https://source.unsplash.com/579x518/?Virgin Islands (British)'
      },
      {
        picture: 'https://source.unsplash.com/503x548/?Angola'
      },
      {
        picture: 'https://source.unsplash.com/511x630/?Mauritania'
      },
      {
        picture: 'https://source.unsplash.com/414x767/?Sri Lanka'
      },
      {
        picture: 'https://source.unsplash.com/443x704/?St. Helena'
      },
      {
        picture: 'https://source.unsplash.com/441x1145/?Namibia'
      },
      {
        picture: 'https://source.unsplash.com/491x1097/?Samoa'
      },
      {
        picture: 'https://source.unsplash.com/570x851/?Eritrea'
      },
      {
        picture: 'https://source.unsplash.com/560x1072/?Iraq'
      },
      {
        picture: 'https://source.unsplash.com/551x598/?Togo'
      },
      {
        picture: 'https://source.unsplash.com/518x813/?Romania'
      },
      {
        picture: 'https://source.unsplash.com/497x524/?Kenya'
      },
      {
        picture: 'https://source.unsplash.com/549x826/?Martinique'
      },
      {
        picture: 'https://source.unsplash.com/559x627/?Tokelau'
      },
      {
        picture: 'https://source.unsplash.com/594x513/?Belize'
      },
      {
        picture: 'https://source.unsplash.com/480x1181/?Virgin Islands (US)'
      },
      {
        picture: 'https://source.unsplash.com/526x552/?Chile'
      },
      {
        picture: 'https://source.unsplash.com/427x504/?Western Sahara'
      },
      {
        picture: 'https://source.unsplash.com/468x971/?St. Pierre and Miquelon'
      },
      {
        picture: 'https://source.unsplash.com/419x790/?Thailand'
      },
      {
        picture: 'https://source.unsplash.com/417x1125/?Myanmar'
      },
      {
        picture: 'https://source.unsplash.com/480x632/?Cocos (Keeling Islands)'
      },
      {
        picture: 'https://source.unsplash.com/416x900/?Belarus'
      },
      {
        picture: 'https://source.unsplash.com/408x837/?Panama'
      },
      {
        picture: 'https://source.unsplash.com/541x1021/?Slovak Republic'
      },
      {
        picture: 'https://source.unsplash.com/597x1107/?Malta'
      },
      {
        picture: 'https://source.unsplash.com/487x842/?Bahrain'
      },
      {
        picture: 'https://source.unsplash.com/403x904/?Somalia'
      },
      {
        picture: 'https://source.unsplash.com/544x515/?Morocco'
      },
      {
        picture: 'https://source.unsplash.com/577x1044/?Djibouti'
      },
      {
        picture: 'https://source.unsplash.com/404x437/?France, Metropolitan'
      },
      {
        picture: 'https://source.unsplash.com/482x1079/?Libya'
      },
      {
        picture: 'https://source.unsplash.com/473x887/?Bolivia'
      },
      {
        picture: 'https://source.unsplash.com/583x614/?Kazakhstan'
      },
      {
        picture: 'https://source.unsplash.com/592x838/?Guyana'
      },
      {
        picture: 'https://source.unsplash.com/422x731/?Switzerland'
      },
      {
        picture: 'https://source.unsplash.com/448x985/?Venezuela'
      },
      {
        picture: 'https://source.unsplash.com/494x936/?Uzbekistan'
      },
      {
        picture: 'https://source.unsplash.com/461x762/?Benin'
      },
      {
        picture: 'https://source.unsplash.com/550x676/?Palau'
      },
      {
        picture: 'https://source.unsplash.com/524x901/?Laos'
      },
      {
        picture: 'https://source.unsplash.com/594x1199/?French Southern Territories'
      },
      {
        picture: 'https://source.unsplash.com/557x662/?Malawi'
      },
      {
        picture: 'https://source.unsplash.com/428x1184/?Swaziland'
      },
      {
        picture: 'https://source.unsplash.com/433x631/?Lithuania'
      },
      {
        picture: 'https://source.unsplash.com/523x477/?Sweden'
      },
      {
        picture: 'https://source.unsplash.com/568x443/?Bahamas'
      },
      {
        picture: 'https://source.unsplash.com/434x448/?United Arab Emirates'
      },
      {
        picture: 'https://source.unsplash.com/566x740/?Puerto Rico'
      },
      {
        picture: 'https://source.unsplash.com/481x580/?Nicaragua'
      },
      {
        picture: 'https://source.unsplash.com/470x761/?Viet Nam'
      },
      {
        picture: 'https://source.unsplash.com/519x954/?Australia'
      },
      {
        picture: 'https://source.unsplash.com/405x1030/?Marshall Islands'
      },
      {
        picture: 'https://source.unsplash.com/587x1059/?Falkland Islands (Malvinas)'
      },
      {
        picture: 'https://source.unsplash.com/593x907/?Montserrat'
      },
      {
        picture: 'https://source.unsplash.com/462x729/?British Indian Ocean Territory'
      },
      {
        picture: 'https://source.unsplash.com/538x610/?Norway'
      },
      {
        picture: 'https://source.unsplash.com/506x1057/?Malaysia'
      },
      {
        picture: 'https://source.unsplash.com/588x756/?Anguilla'
      },
      {
        picture: 'https://source.unsplash.com/468x1047/?Senegal'
      },
      {
        picture: 'https://source.unsplash.com/574x498/?Zaire'
      },
      {
        picture: 'https://source.unsplash.com/594x635/?Ireland'
      },
      {
        picture: 'https://source.unsplash.com/448x759/?Nauru'
      },
      {
        picture: 'https://source.unsplash.com/540x619/?Mayotte'
      },
      {
        picture: 'https://source.unsplash.com/552x438/?Syria'
      },
      {
        picture: 'https://source.unsplash.com/563x759/?Ghana'
      },
      {
        picture: 'https://source.unsplash.com/569x1171/?Austria'
      },
      {
        picture: 'https://source.unsplash.com/581x657/?Macau'
      },
      {
        picture: 'https://source.unsplash.com/539x1013/?Mozambique'
      },
      {
        picture: 'https://source.unsplash.com/581x477/?Liechtenstein'
      },
      {
        picture: 'https://source.unsplash.com/495x589/?Saint Vincent and The Grenadines'
      },
      {
        picture: 'https://source.unsplash.com/579x680/?Brazil'
      },
      {
        picture: 'https://source.unsplash.com/467x642/?Turks and Caicos Islands'
      },
      {
        picture: 'https://source.unsplash.com/496x1186/?Italy'
      },
      {
        picture: 'https://source.unsplash.com/416x844/?Reunion'
      },
      {
        picture: 'https://source.unsplash.com/442x569/?Sierra Leone'
      },
      {
        picture: 'https://source.unsplash.com/517x1084/?Northern Mariana Islands'
      },
      {
        picture: 'https://source.unsplash.com/431x1164/?Belgium'
      },
      {
        picture: 'https://source.unsplash.com/541x649/?Netherlands'
      },
      {
        picture: 'https://source.unsplash.com/491x902/?Korea (South)'
      },
      {
        picture: 'https://source.unsplash.com/534x778/?Guinea'
      },
      {
        picture: 'https://source.unsplash.com/528x933/?Tunisia'
      },
      {
        picture: 'https://source.unsplash.com/441x609/?Tonga'
      },
      {
        picture: 'https://source.unsplash.com/469x1060/?Equatorial Guinea'
      },
      {
        picture: 'https://source.unsplash.com/588x794/?S. Georgia and S. Sandwich Isls.'
      },
      {
        picture: 'https://source.unsplash.com/536x1103/?Algeria'
      },
      {
        picture: 'https://source.unsplash.com/541x821/?Israel'
      },
      {
        picture: 'https://source.unsplash.com/414x541/?Bulgaria'
      },
      {
        picture: 'https://source.unsplash.com/477x879/?Turkmenistan'
      },
      {
        picture: 'https://source.unsplash.com/450x777/?Croatia (Hrvatska)'
      },
      {
        picture: 'https://source.unsplash.com/528x978/?Cook Islands'
      },
      {
        picture: 'https://source.unsplash.com/521x686/?Solomon Islands'
      },
      {
        picture: 'https://source.unsplash.com/550x432/?Bosnia and Herzegovina'
      },
      {
        picture: 'https://source.unsplash.com/540x631/?Tanzania'
      },
      {
        picture: 'https://source.unsplash.com/594x443/?Chad'
      }
    ];
  }

  public onTabChange(e) {
    let { index } = e;
    window.dispatchEvent(new Event('resize'));
  }

  public extractListSelectedItems(hotel, room) {
    let selectedIds = _.compact(_.flatten(_.map(_.flatten(_.map(hotel.rooms, 'rateList')), 'selectedItemIds')));
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
    this.selectedIds = selectedIds;
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

  public reserveRooms() {
    let selectedItems = _.flattenDeep(_.map(this.hotel.rooms, (room) => {
      return _.map(room.rateList, (rateList) => {
        return _.map(rateList.selectedItemIds, (itemId) => {
          return {
            itemId,
            room,
            tempId: rateList.tempId,
            rateName: rateList.rate.name,
            rateTypeId: rateList.rate.id,
            rateValue: rateList.rateValue
          };
        });
      });
    }));
    // let selectedItems = _.compact(_.flatten(_.map(_.flatten(_.map(this.hotel.rooms, 'rateList')), 'selectedItemIds')));
    this.authService.bookingInfo = {
      ...this.authService.bookingInfo,
      items: selectedItems
    };
    this.authService.navigateByUrl(['search', 'book-now']);
  }
}
