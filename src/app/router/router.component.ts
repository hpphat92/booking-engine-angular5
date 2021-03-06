import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { PartnerService, PartnerSettingService } from '../shared/api';
import * as _ from 'lodash';
import { SettingKeyMap } from '../app.constant';
import { AppMainService} from '../app.service';

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
          title: settingMap[SettingKeyMap.Title],
        };
      });
  }


  ngOnDestroy(): void {
    this.authService.currentPartnerAlliasName = null;
    this.authService.siteResources = null;
  }

}
