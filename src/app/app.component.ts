import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
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
