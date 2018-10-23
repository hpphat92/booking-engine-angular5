// import { Injectable, Injector } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
// import { AuthService } from '../services/auth';
// import { Observable } from 'rxjs/Observable';
// import { Router } from '@angular/router';
// import { HttpResponse } from 'selenium-webdriver/http';
// import { ToastrService } from 'ngx-toastr';
//
// @Injectable()
// export class ErrorsInterceptor implements HttpInterceptor {
//   private noShowError: string[] = [
//     'api/conversations',
//   ];
//
//   constructor(private toastrService: ToastrService,
//               private injector: Injector,
//               private router: Router) {
//
//   }
//
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // add a custom header
//     let authService = this.injector.get(AuthService);
//
//
//     return next.handle(request).catch((err, caught) => {
//
//       if (err instanceof HttpErrorResponse) {
//         if (err.status === 401) {
//           console.log(err.url, 'got 401');
//           if (err.url.endsWith('refresh-token')) {
//             // This is 401 from refresh token
//             authService.logout()
//               .then(() => {
//               });
//             throw Observable.throw('Refresh token error');
//           } else {
//             let observer = authService.exchangeExpiredAccessToken().mergeMap(({ data }) => {
//               authService.setToken(data);
//               const authReq = request.clone({ headers: request.headers.set('Authorization', `Bearer ${data.accessToken}`) });
//               return next.handle(authReq);
//             });
//             observer.catch((error, c): any => {
//               // Refresh token got error
//               authService.logout()
//                 .then(() => {
//                   this.router.navigateByUrl('unauth');
//                 });
//             });
//             return observer;
//           }
//
//         }
//         if (err.status === 403) {
//           this.router.navigateByUrl('auth');
//         }
//         if (err.error && err.error.message) {
//           if (this.noShowError.findIndex(i => request.url.toLowerCase().indexOf(i.toLowerCase()) >= 0) < 0) {
//             this.toastrService.error(err.error.message, 'Error');
//           }
//         }
//         throw err;
//       }
//     });
//   }
// }
