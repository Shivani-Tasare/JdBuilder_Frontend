import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BroadcastService, MsalService } from '@azure/msal-angular';

@Injectable()
export class InsertAuthTokenInterceptor implements HttpInterceptor {
    applicationConfig = {
        Scopes: [ "user.read",'openid',
        'profile', "api://e98d88d4-0e9a-47f3-bddf-568942eac4e9/api.consume"],
                itApiScope: ['api://e98d88d4-0e9a-47f3-bddf-568942eac4e9/api.consume'],
      };
    currentUser = null
    constructor(private authService: MsalService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
       
         this.getItApiToken().then((r)=>{
           this.currentUser = r.accessToken;
        });
        console.log(this.currentUser)
        //this.currentUser = sessionStorage.getItem('adal.idtoken');
        if (!!this.currentUser && !req.url.match(/graph.microsoft.com/)) {
            req = req.clone({
                setHeaders: {
                    "Authorization": "Bearer "+ this.currentUser,
                    'Content-Type': 'application/json',
                    'IsWebLogin' : '1',
                    'Version':'JD Builder',
                }
            });
        } 
        return next.handle(req)
	    .pipe(
	        tap(event => {
	          if (event instanceof HttpHandler) {}
	        }, error => {
	   			// http response status code
              if(error.status === 401){
                localStorage.clear();
                              }
	        })
	      )
    }
        // return this.adalService.acquireTokenResilient(this.config.resource).pipe(
        //     mergeMap((token: string) => {
        //       if (token) {
        //         req = req.clone({
        //             setHeaders: {Authorization : 'Bearer ' + token}
        //         });
        //       }
        //       return next.handle(req);
        // }));

        getItApiToken() {
            const scopes  = this.authService.getScopesForEndpoint('api://e98d88d4-0e9a-47f3-bddf-568942eac4e9/api.consume');
            return this.authService.acquireTokenSilent({scopes}).then(
              accessToken => {
                return accessToken;
              },
              error => {
                console.log(error);
                return this.authService
                  .acquireTokenPopup( {scopes})
                  .then(
                    accessToken => {
                      return accessToken;
                    },
                    err => {
                      console.error(err);
                    }
                  );
              }
            );
          }
    }


