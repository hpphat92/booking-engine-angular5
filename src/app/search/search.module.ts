import { NgModule } from '@angular/core';

import { SearchComponent } from './search.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SearchResultsComponent } from './search-results/search-results.component';
import { HotelDetailComponent } from './hotel-detail/hotel-detail.component';


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
    HotelDetailComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [],
})
export class SearchModule {
}
