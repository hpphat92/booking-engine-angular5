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

const actualRoutes: Routes = [
  ...routes,
  {
    path: ':id',
    redirectTo: 'home-section', pathMatch: 'full'
  },
];


@NgModule({
  declarations: [
    TourGuideComponent,
    TourGuideHomeComponent,
    TourGuideAboutComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(actualRoutes),
  ],
  providers: [
    AppMainService
  ],
})
export class TourGuideModule {
}
