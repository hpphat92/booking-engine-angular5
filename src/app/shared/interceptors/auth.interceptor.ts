import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private inj: Injector) {
  }

  private showLoading(auth, req) {
    auth.showLoading$.next(true);
  }

  private hideLoading(auth, req) {
    auth.showLoading$.next(false);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let auth = this.inj.get(AuthService);
    this.showLoading(auth, req);
    return next.handle(req).do((event: HttpEvent<any>) => {
      if (event.type === 4) {
        // Success
        this.hideLoading(auth, req);
      }
    }, (err: any) => {
      this.hideLoading(auth, req);
    });
  }
}
