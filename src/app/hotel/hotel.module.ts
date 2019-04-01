import {NgModule} from '@angular/core';

import {RouterModule, Routes, PreloadAllModules} from '@angular/router';
import {HotelComponent} from './hotel.component';
import {PaymentSuccessComponent} from '../payment-success/payment-success.component';
import {RouterComponent} from '../router/router.component';

const routes: Routes = [
  {
    path: '',
    component: HotelComponent,
    children: [
      {
        path: '',
        loadChildren: './home/home.module#HomeModule', pathMatch: 'full'
      },
      {
        path: 'search',
        loadChildren: './search/search.module#SearchModule'
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];

@NgModule({

  declarations: [
    HotelComponent
  ],
  imports: [
    // SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    // AppMainService
  ]

  // imports: [RouterModule.forRoot(actualRoutes, {
  //   enableTracing: false,
  //   preloadingStrategy: PreloadAllModules,
  //   // onSameUrlNavigation: 'reload',
  //   useHash: true
  // })],
  // exports: [RouterModule],
  // declarations: [
  //   HotelComponent,
  //   // PaymentSuccessComponent,
  //   // RouterComponent
  // ],
})
export class HotelModule {
}
