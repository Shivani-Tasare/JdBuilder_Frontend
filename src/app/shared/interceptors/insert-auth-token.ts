import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
// import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { AdalService } from '../services/adal.service';
import { APP_CONFIG, AppConfig } from '../../config/config';
import { Observable } from 'rxjs';
@Injectable()
export class InsertAuthTokenInterceptor implements HttpInterceptor {

    constructor(private adalService: AdalService, @Inject(APP_CONFIG) private config: AppConfig) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
        // merge the bearer token into the existing headers
        return this.adalService.acquireTokenResilient(this.config.resource).pipe(
            mergeMap((token: string) => {
              // console.log(token, 'token outsidee');
              if (token) {
                // console.log(token, 'tokennnn');
                req = req.clone({
                    setHeaders: {Authorization : 'Bearer ' + token}
                });
              }
              return next.handle(req);
        }));
    }

}
