import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AppMainService } from '../app.service';
import { TourGuideHomeComponent } from './tour-guide-home/tour-guide-home.component';
import { TourGuideAboutComponent } from './tour-guide-about/tour-guide-about.component';
import { TourGuideComponent } from './tour-guide.component';
import { RouterComponent } from '../router/router.component';

const routes: Routes = [
  {
    path: '',
    component: TourGuideComponent,
    children: [
      {
        path: '', redirectTo: 'home', pathMatch: 'full'
      },
      {
        path: 'home', component: TourGuideHomeComponent
      },
      {
        path: 'about', component: TourGuideAboutComponent
      },
      {
        path: '**', redirectTo: 'home'
      },
    ]
  }
];

@NgModule({
  declarations: [
    TourGuideComponent,
    TourGuideHomeComponent,
    TourGuideAboutComponent,
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
