import { Injectable, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ApiModule } from './api';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PlaceViewerComponent } from './components/place-viewer/place-viewer.component';
import { LocalStorageModule } from 'angular-2-local-storage';
import { AuthService } from './services/auth.service';
import { NguCarouselModule } from '@ngu/carousel';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChoosePassengerComponent } from './components/choose-passenger/choose-passenger.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxMasonryModule } from 'ngx-masonry';
import { AuthInterceptor } from './interceptors';

const modules = [
  MaterialModule,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgxDaterangepickerMd,
  HttpClientModule,
  NguCarouselModule,
  NgSelectModule,
  NgxMasonryModule
];
const components = [
  PlaceViewerComponent,
  ChoosePassengerComponent
];
const services: Provider[] = [
  AuthService
];

@NgModule({
  declarations: [...components],
  imports: [
    ...modules,
    LeafletModule.forRoot(),
    LocalStorageModule.withConfig({
      prefix: 'trabble.booking-engine-v2',
      storageType: 'localStorage'
    }),
  ],
  exports: [
    ...modules,
    ...components,
    LeafletModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [...services
      ]
    };
  }
}
