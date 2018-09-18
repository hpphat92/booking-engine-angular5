import { NgModule } from '@angular/core';

import { SearchComponent } from './search.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SearchResultsComponent } from './search-results/search-results.component';
import { HotelDetailComponent } from './hotel-detail/hotel-detail.component';
import { ModalHotelViewingDetailComponent } from './modal-hotel-viewing-detail/modal-hotel-viewing-detail.component';
import { MakeBookingComponent } from './make-booking/make-booking.component';


const routes: Routes = [
  {
    path: '', component: SearchComponent,
    children: [
      {
        path: 'results', component: SearchResultsComponent
      },
      {
        path: 'detail/:id', component: HotelDetailComponent
      },
      {
        path: 'book-now', component: MakeBookingComponent
      },
      {
        path: '**',
        redirectTo: 'results'
      }
    ]
  }
];

@NgModule({
  declarations: [
    SearchComponent,
    SearchResultsComponent,
    HotelDetailComponent,
    ModalHotelViewingDetailComponent,
    MakeBookingComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: [
    ModalHotelViewingDetailComponent
  ],
  providers: [],
})
export class SearchModule {
}
