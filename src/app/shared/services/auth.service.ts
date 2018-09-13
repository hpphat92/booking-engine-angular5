import { Component, OnInit, Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

@Injectable()
export class AuthService {

  private _search;
  private _hotelDetail;
  private _bookingInfo;
  private _userInfo;

  private _currentPartnerId;

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

  get currentPartnerId() {
    return this._currentPartnerId;
  }

  set currentPartnerId(value) {
    this._currentPartnerId = value;
  }

  constructor(public localStorageService: LocalStorageService,
              public router: Router,
              public route: ActivatedRoute) {
  }

  public navigateByUrl(url, opt = {}) {
    this.router.navigate(_.compact(['/', this.currentPartnerId, url]), { relativeTo: this.route, ...opt });
  }
}
