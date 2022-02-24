import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs/operators';
import { KorisnikLogovanjeService } from './korisnikLogovanje.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private logService: KorisnikLogovanjeService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.logService.loggedKorisnik.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq: HttpRequest<any> = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + user.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
