import { Injectable } from '@angular/core';
import { Observable, Subscriber, Subject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { AdalConfigService } from './adal-config.service';
import { adal } from 'adal-angular';

declare var AuthenticationContext: adal.AuthenticationContextStatic;
const createAuthContextFn: adal.AuthenticationContextStatic = AuthenticationContext;
@Injectable()
export class AdalService {
  private isUserAuthenticated = new Subject<boolean>();
  private context: adal.AuthenticationContext;
  constructor(private configService: AdalConfigService) {
    this.context = new createAuthContextFn(configService.AdalSettings);
  }
  login() {
    this.context.login();
  }
  logout() {
    this.context.logOut();
  }
  get authContext() {
    return this.context;
  }
  handleCallback() {
    this.context.handleWindowCallback();
  }
  public get userInfo() {

    return this.context.getCachedUser();
}
public get accessToken() {  
    return this.context.getCachedToken(this.configService.AdalSettings.clientId);
}
public get isAuthenticated() {
    return this.userInfo && this.accessToken;
}

public isCallback(hash: string) {
    return this.context.isCallback(hash);
}

public getLoginError() {
    return this.context.getLoginError();
}

public getAccessToken(endpoint: string, callbacks: (message: string, token: string) => any) {
    return this.context.acquireToken(endpoint, callbacks);
}

public acquireTokenResilient(resource: string): Observable<any> {
    // console.log(resource, 'resource');
    return new Observable<any>((subscriber: Subscriber<any>) =>
        this.context.acquireToken(resource, (message: string, token: string) => {
           //  console.log(token, 'tokennn');
            if (token) {
                this.isUserAuthenticated.next(true);
                subscriber.next(token);
            } else {
                this.isUserAuthenticated.next(false);
             //   console.error(message);
                this.login();
                subscriber.error(message);
                // this.login();
            }
        })
    ).pipe(retry(1));
}
public getUserAuthenticationStatus(): Observable<any> {
  return this.isUserAuthenticated.asObservable();
}
}
