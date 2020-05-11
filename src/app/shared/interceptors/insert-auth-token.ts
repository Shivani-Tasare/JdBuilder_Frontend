import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Injectable()
export class InsertAuthTokenInterceptor implements HttpInterceptor {

    constructor(private authService: MsalService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
        const headers = req.headers
        .set('Authorization', 'Bearer ' + localStorage.getItem('msal.idtoken'))
        .append('Content-Type', 'application/json');
const requestClone = req.clone({
 headers 
});
return next.handle(requestClone);
        // return from(this.getItApiToken())
        //       .pipe(
        //         switchMap(token => {
        //            const headers = req.headers
        //                     .set('Authorization', 'Bearer ' + token)
        //                     .append('Content-Type', 'application/json');
        //            const requestClone = req.clone({
        //              headers 
        //             });
        //           return next.handle(requestClone);
        //         })
        //        );
        // }   
        // getItApiToken() {
        //     const scopes  = this.authService.getScopesForEndpoint('api://e98d88d4-0e9a-47f3-bddf-568942eac4e9/api.consume');
        //     return this.authService.acquireTokenSilent({scopes}).then(
        //       accessToken => {
        //         return accessToken.accessToken;
        //       },
        //       error => {
        //         console.log(error);
        //         return this.authService
        //           .acquireTokenPopup( {scopes})
        //           .then(
        //             accessToken => {
        //               return accessToken;
        //             },
        //             err => {
        //               console.error(err);
        //             }
        //           );
        //       }
        //     );
           }
    }


