import { NgModule } from '@angular/core';

import { TourGuideHomeComponent } from './tour-guide-home.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: TourGuideHomeComponent
  }
]

@NgModule({
  declarations: [
    TourGuideHomeComponent
  ],
  imports: [
    RouterModule.forChild(routes),
  ],
  providers: [
  ],
})
export class TourGuideHomeModule {
}
