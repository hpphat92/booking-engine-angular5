import { NgModule } from '@angular/core';

import { SearchComponent } from './search.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SearchResultsComponent } from './search-results/search-results.component';


const routes: Routes = [
  {
    path: '', component: SearchComponent,
    children: [
      {
        path: 'results', component: SearchResultsComponent
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
    SearchResultsComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [],
})
export class SearchModule {
}
