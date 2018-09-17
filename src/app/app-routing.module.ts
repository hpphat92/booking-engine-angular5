import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeModule } from './home/home.module';
import { RouterComponent } from './router/router.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule'
  },
  {
    path: 'search',
    loadChildren: './search/search.module#SearchModule'
  },
];
const actualRoutes: Routes = [
  ...routes,
  {
    path: ':id',
    component: RouterComponent,
    children: [
      ...routes,
      {
        path: '**',
        redirectTo: 'home'
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(actualRoutes, {
    enableTracing: true,
    preloadingStrategy: PreloadAllModules,
    onSameUrlNavigation: 'reload',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
