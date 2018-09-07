import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ApiModule } from './api';
import { HttpClientModule } from '@angular/common/http';
import { PlaceViewerComponent } from './components/place-viewer/place-viewer.component';


const modules = [
  MaterialModule,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgxDaterangepickerMd,
  HttpClientModule
];
const components = [
  PlaceViewerComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    ...modules
  ],
  exports: [
    ...modules,
    ...components
  ]
})
export class SharedModule {

}
