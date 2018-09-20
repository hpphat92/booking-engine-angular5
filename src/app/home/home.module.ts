import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import AppMainService from '../app.service';


const routes: Routes = [
  {
    path: '', component: HomeComponent
  }
]

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    AppMainService
  ],
})
export class HomeModule {
}
