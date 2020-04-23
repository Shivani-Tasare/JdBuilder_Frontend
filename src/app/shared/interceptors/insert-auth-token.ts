import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { AdalService } from '../services/adal.service';
import { APP_CONFIG, AppConfig } from '../../config/config';
import { Observable } from 'rxjs';
@Injectable()
export class InsertAuthTokenInterceptor implements HttpInterceptor {

    constructor(private adalService: AdalService, @Inject(APP_CONFIG) private config: AppConfig) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
        return this.adalService.acquireTokenResilient(this.config.resource).pipe(
            mergeMap((token: string) => {
              if (token) {
                req = req.clone({
                    setHeaders: {Authorization : 'Bearer ' + token}
                });
              }
              return next.handle(req);
        }));
    }

}
