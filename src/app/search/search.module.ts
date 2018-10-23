import { NgModule } from '@angular/core';

import { SearchComponent } from './search.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SearchResultsComponent } from './search-results/search-results.component';
import { HotelDetailComponent } from './hotel-detail/hotel-detail.component';
import { ModalHotelViewingDetailComponent } from './modal-hotel-viewing-detail/modal-hotel-viewing-detail.component';
import { MakeBookingComponent } from './make-booking/make-booking.component';
import { BookingConfirmedComponent } from './booking-confirmed/booking-confirmed.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';


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
        path: 'booking-completed', component: BookingConfirmedComponent
      },
      {
        path: 'manage-booking', component: ManageBookingComponent
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
    MakeBookingComponent,
    BookingConfirmedComponent,
    ManageBookingComponent,
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
