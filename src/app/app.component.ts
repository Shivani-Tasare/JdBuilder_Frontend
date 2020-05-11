import { Component, Inject, OnInit, HostListener,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { JobServiceService } from './shared/services/job-service.service';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { Logger, CryptoUtils } from 'msal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'jobProject';
  isAuthenticated = false;
  subscription: Subscription;
  isCollapseOn = false;
  selectedIndex = 2;
  isIframe = false;
  loggedIn = false;

  @HostListener('document:click', ['$event'])
  clickout(event) {
       setTimeout(()=>{
      if(!document.querySelector("#collapsibleNavbar.show")){
        this.isCollapseOn = false
      }else{
        this.isCollapseOn = true
      }
    },300)
  }
  @HostListener('wheel', ['$event'])
  handleWheelEvent(event) {
    if(this.isCollapseOn){
      event.preventDefault();
    }
  }
  constructor(private broadcastService: BroadcastService, private authService: MsalService,
    private jobService:JobServiceService, private eRef: ElementRef, private router: Router) {
    router.events.subscribe(val => {
      if (location.pathname.indexOf("myJd") > 0) {
        this.selectedIndex = 2;
      }
      if (location.pathname.indexOf("allJd") > 0) {
        this.selectedIndex = 1;
      }
    });
   }
  ngOnInit() {;

    this.isIframe = window !== window.parent && !window.opener;
    this.broadcastService.subscribe('msal:acquireTokenSuccess', (payload) => {
      console.log(payload);
      console.log('access token acquired: ' + new Date().toString());
    });
    this.broadcastService.subscribe('msal:acquireTokenFailure', (payload) => {
      console.log(payload);
      console.log('access token acquisition fails');
    });
    this.checkAccount();

    this.broadcastService.subscribe('msal:loginSuccess', (payload) => {
      console.log(payload);
      this.checkAccount();
    });
    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }

      console.log('Redirect Success: ', response.accessToken);
    });

    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));

  }

  checkAccount() {
    this.loggedIn = !!this.authService.getAccount();
    if(!this.loggedIn) {
      this.login();
    }
  }

  login() {
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    this.authService.loginRedirect();
  }

  logout() {
    this.authService.logout();
  }
  
}
