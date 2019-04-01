import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { PartnerService } from '../shared/api';
import * as _ from 'lodash';
import { SettingKeyMap, BookingEngineType } from '../app.constant';
import { AppMainService } from '../app.service';

@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.scss']
})
export class RouterComponent implements OnDestroy {
  constructor(public router: Router,
    public route: ActivatedRoute,
    public appMainService: AppMainService,
    public partnerService: PartnerService,
    public authService: AuthService) {
    this.route.params.subscribe((param) => {
      let { id: partnerAlliasName } = param;
      this.authService.currentPartnerAlliasName = partnerAlliasName;
      this.loadSettingsByPartnerId(partnerAlliasName);
    });
  }

  public loadSettingsByPartnerId(partnerAlliasName) {
    if (!partnerAlliasName) {
      return;
    }
    this.appMainService.getPartnerSettingByPartnerName(partnerAlliasName)
      .subscribe((resp: any) => {
        if (!resp || !resp.length) {
          // No partner found
          this.router.navigate(['']);
          return;
        }
        let settingMap = _.fromPairs(_.map(resp, (x) => [x.key, x.value]));
        let carouselPhotos = [];
        try {
          carouselPhotos = JSON.parse(settingMap[SettingKeyMap.CarouselImages]);
        } catch (e) {
          carouselPhotos = [];
        }
        this.authService.siteResources = {
          fromPartnerId: resp[0].partnerId,
          fromPartner: partnerAlliasName,
          favIcon: settingMap[SettingKeyMap.FavIcon],
          name: settingMap[SettingKeyMap.Name],
          mainLogo: settingMap[SettingKeyMap.MainLogo],
          mainVideo: settingMap[SettingKeyMap.PreviewVideo],
          carouselPhotos: carouselPhotos,
          title: settingMap[SettingKeyMap.Title]
        };

        this.authService.tourguideResources = {
          email: settingMap[SettingKeyMap.TourGuideEmail],
          phone: settingMap[SettingKeyMap.TourGuidePhone],
          seftDescription: settingMap[SettingKeyMap.TourGuideSeftDescription],
          languages: settingMap[SettingKeyMap.TourGuideLanguages],
          specializations: settingMap[SettingKeyMap.TourGuideSpecializations],
          images: settingMap[SettingKeyMap.TourGuideImages],
          affiliationsRecognition: settingMap[SettingKeyMap.TourGuideAffiliationsRecognition],
          title: settingMap[SettingKeyMap.TourGuideTitle],
          aboutTitle: settingMap[SettingKeyMap.TourGuideAboutTitle],
          aboutDescription: settingMap[SettingKeyMap.TourGuideAboutDescription]
        };

        this.getBookingEngineType(partnerAlliasName);
      });
  }

  public getBookingEngineType(partnerAlliasName: string) {
    this.appMainService.getBookingEngineTypeByAlias(partnerAlliasName)
      .subscribe((resp: any) => {
        if (resp.data === BookingEngineType.TourGuide) {
          this.router.navigateByUrl(partnerAlliasName + '/tour-guide');
        } else {
          this.router.navigateByUrl(partnerAlliasName + '/home');
        }
      });
  }

  ngOnDestroy(): void {
    this.authService.currentPartnerAlliasName = null;
    this.authService.siteResources = null;
  }

}
