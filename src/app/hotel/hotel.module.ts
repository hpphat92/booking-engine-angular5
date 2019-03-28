import { NgModule } from '@angular/core';

import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { HotelComponent } from './hotel.component';
import { PaymentSuccessComponent } from '../payment-success/payment-success.component';
import { RouterComponent } from '../router/router.component';

const routes: Routes = [
  {
    path: '',
    component: HotelComponent,
    children: [
      {
        path: '', redirectTo: 'home-section', pathMatch: 'full'
      },
      {
        path: 'home-section',
        loadChildren: '../home/home.module#HomeModule'
      },
    ]
  }
]

const actualRoutes: Routes = [
  ...routes,
  // {
  //   path: 'payment-success',
  //   component: PaymentSuccessComponent
  // },
  // {
  //   path: ':id',
  //   component: RouterComponent,
  //   children: [
  //     ...routes,
  //     {
  //       path: '**',
  //       redirectTo: 'home'
  //     }
  //   ],
  // },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({

  declarations: [
    HotelComponent,
  ],
  imports: [
    // SharedModule,
    RouterModule.forChild(actualRoutes),
  ],
  providers: [
    // AppMainService
  ],

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
