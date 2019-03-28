import { NgModule } from '@angular/core';

import { TourGuideAboutComponent } from './tour-guide-about.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: TourGuideAboutComponent
  }
]

@NgModule({
  declarations: [
    TourGuideAboutComponent
  ],
  imports: [
    RouterModule.forChild(routes),
  ],
  providers: [
  ],
})
export class TourGuideAboutModule {
}
