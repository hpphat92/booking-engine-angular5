import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { ApiModule, BASE_PATH, Configuration } from './shared/api';
import { AppConstant } from './app.constant';
import './rxjs-operators';
import { RouterComponent } from './router/router.component';
import { AppMainService } from './app.service';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { BlankComponent } from './blank/blank.component';
import { TourGuideModule } from './tour-guide/tour-guide.module';

let domain = {
  toString: () => AppConstant.domain,
  valueof: () => AppConstant.domain,
};

@NgModule({
  declarations: [
    AppComponent,
    RouterComponent,
    PaymentSuccessComponent,
    BlankComponent
  ],
  imports: [
    ApiModule.forRoot((): Configuration => {
      return new Configuration({
        apiKeys: {},
      });
    }),
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule.forRoot(),
    AppRoutingModule,
    TourGuideModule,
  ], providers: [
    { provide: BASE_PATH, useValue: domain },
    AppMainService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
