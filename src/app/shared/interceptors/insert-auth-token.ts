import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Injectable()
export class InsertAuthTokenInterceptor implements HttpInterceptor {

    constructor(private authService: MsalService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = localStorage.getItem('msal.idtoken')
        let graphToken = localStorage.getItem('graphToken');
        if (currentUser && !request.url.match(/graph.microsoft.com/)) {
            request = request.clone({
                setHeaders: {
                    "Authorization": "Bearer "+ currentUser,
                    'Content-Type': 'application/json',
                    'IsWebLogin' : '1',
                    'Version':'JD',
                }
            });
        } 
        return next.handle(request)
	    .pipe(
	        tap(event => {
	          if (event instanceof HttpResponse) {}
	        }, error => {
	   			// http response status code
              if(error.status === 401){
                localStorage.clear();
              //  this.router.navigate(['/']);
              }
	        })
	      )
    }
    }


