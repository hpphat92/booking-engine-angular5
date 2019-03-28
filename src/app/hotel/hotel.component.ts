import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnDestroy {
  title = 'app';
  public form: FormGroup;
  public isShowLoading = false;

  public siteResources: any;
  public subscription: any;

  constructor(public formBuilder: FormBuilder,
    public authService: AuthService) {
    this.form = this.formBuilder.group({
      keyword: [''],
      checkInCheckOut: ['', Validators.required],
      numberOfPax: [''],
      isTraveliingForWork: ['']
    });
    this.siteResources = this.authService.siteResources;
    this.subscription = this.authService.siteResource$.subscribe((newSiteResource) => {
      this.siteResources = newSiteResource;
    });
    this.authService.showLoading$.subscribe((isShow) => {
      setTimeout(() => {
        this.isShowLoading = isShow;
      });
    });
  }

  public navigateToHome() {
    this.authService.navigateByUrl('');
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }
}
