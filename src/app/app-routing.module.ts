import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {RouterComponent} from './router/router.component';
import {PaymentSuccessComponent} from './payment-success/payment-success.component';

const actualRoutes: Routes = [
  {
    path: 'home',
    loadChildren: './hotel/hotel.module#HotelModule',
  },
  {
    path: 'payment-success',
    component: PaymentSuccessComponent
  },
  {
    path: ':id',
    component: RouterComponent,
    children: [
      {
        path: 'home',
        loadChildren: './hotel/hotel.module#HotelModule',
      },
      {
        path: 'tour-guide',
        loadChildren: './tour-guide/tour-guide.module#TourGuideModule'
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(actualRoutes, {
    enableTracing: false,
    preloadingStrategy: PreloadAllModules,
    // onSameUrlNavigation: 'reload',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
