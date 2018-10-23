import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { ApiModule, BASE_PATH, Configuration } from './shared/api';
import {AppConstant} from './app.constant';
import './rxjs-operators';
import { RouterComponent } from './router/router.component';
import { AppMainService } from './app.service';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptors';

let domain = {
  toString: () => AppConstant.domain,
  valueof: () => AppConstant.domain,
};

@NgModule({
  declarations: [
    AppComponent,
    RouterComponent,
    PaymentSuccessComponent
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

  ], providers: [
    { provide: BASE_PATH, useValue: domain },
    AppMainService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
