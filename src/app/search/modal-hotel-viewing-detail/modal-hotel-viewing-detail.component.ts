import { AfterViewInit, Component, ElementRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IMasonryGalleryImage } from 'ngx-masonry-gallery';
import { icon, LatLng, latLng, Marker, marker } from 'leaflet';
import * as L from 'leaflet';
import * as iconUrl from 'leaflet/dist/images/marker-icon.png';
import * as shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant';
import { AuthService } from '../../shared/services/auth.service';
import AppConstant from '../../app.constant';
import * as moment from 'moment';
import * as _ from 'lodash';
import { BookingService } from '../../shared/api';

@Component({
  selector: 'app-modal-hotel-viewing-detail',
  templateUrl: './modal-hotel-viewing-detail.component.html',
  styleUrls: ['./modal-hotel-viewing-detail.component.scss']
})
export class ModalHotelViewingDetailComponent {
  public hotel;
  public newMarker;
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

  constructor(public dialogRef: MatDialogRef<ModalHotelViewingDetailComponent>,
              public authService: AuthService,
              public bookingService: BookingService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.hotel = {
      ...this.data.hotel,
      get listImages() {
        return data.hotel.images.map(m => <IMasonryGalleryImage>{
          imageUrl: m
        });
      }
    };
    this.hotel.location = latLng(this.hotel.latitude, this.hotel.longitude);
    this.getHotelFullInfo(this.hotel);

  }

  mapReady(map) {
    (L.gridLayer as any).googleMutant({
      maxZoom: 24,
      type: 'roadmap'
    }).addTo(map);
    map.panTo(this.hotel.location);
    map.addLayer(this.createMarker(this.hotel.location));
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
      moment(modelSearch.checkOut).format(AppConstant.typeFormat.date),
    ).subscribe((resp) => {
      let data: any = resp.data;
      hotel.rooms = _.flatten(_.map(data.rooms, (room) => {
        return _.flatten(_.map(room.rateTypes, (rate) => {
          let groupRates = _.groupBy(rate.items, 'rate');
          return _.map(_.toPairs(groupRates), ([rateValue, items]) => {
            return {
              rate,
              rateValue: +rateValue,
            };
          });
        }));
      }));
    });
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

  public onTabChange(e) {
    let { index } = e;
    if ([0, 2].indexOf(index) > -1) {
      window.dispatchEvent(new Event('resize'));
    }
  }

  public goDetail(hotel) {
    this.dialogRef.close();
    this.authService.hotelDetail = hotel;
    this.authService.navigateByUrl(['search', 'detail', hotel.id]);
  }
}
