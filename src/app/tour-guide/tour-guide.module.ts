import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AppMainService } from '../app.service';
import { TourGuideHomeComponent } from './tour-guide-home/tour-guide-home.component';
import { TourGuideAboutComponent } from './tour-guide-about/tour-guide-about.component';
import { TourGuideComponent } from './tour-guide.component';

const routes: Routes = [
  {
    path: '',
    component: TourGuideComponent,
    children: [
      {
        path: '', redirectTo: 'home-section', pathMatch: 'full'
      },
      {
        path: 'home-section', component: TourGuideHomeComponent
      },
      {
        path: 'about-section', component: TourGuideAboutComponent
      },
      {
        path: '**', redirectTo: 'home-section'
      },
    ]
  }
]

@NgModule({
  declarations: [
    TourGuideComponent,
    TourGuideHomeComponent,
    TourGuideAboutComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    AppMainService
  ],
})
export class TourGuideModule {
}
