import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export default class AppMainService {

  constructor(private http: HttpClient) {

  }

  public getPartnerSettingByPartnerName(partnerName) {
    return this.http.get(`/api/settings/` + partnerName);
  }

  public searchProperties(partnerId, parentId = '') {
    return this.http.get(`/api/search?partner=${partnerId}&parent=${parentId}`);
  }

  public searchInventoryTypes() {
    return this.http.get(`/api/inventory-types`);
  }
}
