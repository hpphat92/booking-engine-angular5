import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {

  private _search;
  private _hotelDetail;
  private _bookingInfo;
  private _userInfo;
  public showLoading$: Subject<boolean> = new Subject<boolean>();

  private _currentPartnerAlliasName;

  private _defaultSiteResource = {
    fromPartnerId: '',
    fromPartner: null,
    favIcon: 'favicon.png',
    name: 'Trabble | Booking Engine New Version',
    mainLogo: '/assets/images/trabble-logo.png',
    mainVideo: 'https://grochtdreis.de/fuer-jsfiddle/video/sintel_trailer-480.mp4',
    carouselPhotos: ['/assets/images/japan1.jpg', '/assets/images/japan2.jpg', '/assets/images/japan3.jpg'],
    title: `Great deals are here,
            Finally.`
  };
  private _siteResources = { ...this._defaultSiteResource };

  get search() {
    return { ...(this._search || this.localStorageService.get('search')) };
  }

  set search(value) {
    this._search = value;
    this.localStorageService.set('search', value);
  }

  get hotelDetail() {
    return this._hotelDetail || this.localStorageService.get('hotelDetail');
  }

  set hotelDetail(value) {
    this._hotelDetail = value;
    this.localStorageService.set('hotelDetail', value);
  }

  get bookingInfo() {
    return this._bookingInfo || this.localStorageService.get('booking-info') || {};
  }

  set bookingInfo(value) {
    this._bookingInfo = value;
    this.localStorageService.set('booking-info', value);
  }

  get userInfo() {
    return this._userInfo || this.localStorageService.get('user-info') || {};
  }

  set userInfo(value) {
    this._userInfo = value;
    this.localStorageService.set('user-info', value);
  }

  get currentPartnerAlliasName() {
    return this._currentPartnerAlliasName;
  }

  set currentPartnerAlliasName(value) {
    this._currentPartnerAlliasName = value;
    if (!value) {
      this.siteResources = null;
    }
  }

  get siteResources() {
    return this._siteResources;
  }

  set siteResources(value) {
    value = value || this._defaultSiteResource;
    this._siteResources = value;
    this.siteResource$.next(value);
    this.updateSettingResoures();
  }

  public siteResource$: Subject<any> = new Subject<any>();

  constructor(public localStorageService: LocalStorageService,
              public router: Router,
              private titleService: Title,
              public route: ActivatedRoute) {
    this.updateSettingResoures();
  }


  public updateSettingResoures() {
    this.titleService.setTitle(this.siteResources.name);
    document.getElementById('appFavicon').setAttribute('href', this.siteResources.favIcon);
  }


  public navigateByUrl(url, opt = {}) {
    this.router.navigate(_.compact(_.flatten(['/', this.currentPartnerAlliasName, url])), { relativeTo: this.route, ...opt });
  }
}
