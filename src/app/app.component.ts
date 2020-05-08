import { Component, Inject, OnInit, HostListener,ElementRef, Compiler} from '@angular/core';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { JobServiceService } from './shared/services/job-service.service';
import { MsalService } from "@azure/msal-angular";
import { BroadcastService } from "@azure/msal-angular";

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
  constructor(
    private router: Router, 
    private _compiler: Compiler,
     private authService: MsalService,
     private broadcastService: BroadcastService,
    private jobService:JobServiceService, private eRef: ElementRef) {
      this.isIframe = window !== window.parent && !window.opener;  
      if (this.authService.getUser()) {
        this.apiToken();
      }
    router.events.subscribe(val => {
      if (location.pathname.indexOf("myJd") > 0) {
        this.selectedIndex = 2;
      }
      if (location.pathname.indexOf("allJd") > 0) {
        this.selectedIndex = 1;
      }
    });
   }
   ngOnInit() {
     if(!this.authService.getUser()) {
      this.authService.loginRedirect();
     }
    this._compiler.clearCache();
    this.subscription = this.broadcastService.subscribe("msal:loginFailure", (payload) => {
      //this.loading = false;
      this.authService.logout();
    });
    this.subscription = this.broadcastService.subscribe("msal:loginSuccess", (payload) => {
      this.apiToken();
    });
  }
 

  apiToken() {
    this.authService.acquireTokenSilent(['api://e98d88d4-0e9a-47f3-bddf-568942eac4e9/api.consume']).then(
      accessToken => {
        localStorage.setItem("accessToken", accessToken);
        this.authService.acquireTokenSilent(["https://graph.microsoft.com/user.read"]).then(token => {
          localStorage.setItem("graphToken", token);
        });
        this.getProfile();
      },
      error => {
        //this.loading = false;
        this.router.navigate(['/']);
        localStorage.clear();
        // this.authService.acquireTokenPopup([environment.apiKey]).then(
        //   accessToken => {
        //     localStorage.setItem("accessToken", accessToken);
        //     this.getProfile();
        //   },
        //   error => {
        // this.loading = false;
        // this.showErrorMessage(error.message);
        // localStorage.clear();
        //   })

      })
  }

  getProfile() {
    this.jobService.getProfile().subscribe(profile => {
      if (profile != null) {
        localStorage.setItem("roleInfo", JSON.stringify(profile));
        this.router.navigate(['dashboard']);
      }
      else {
        //this.loading = false;
        this.router.navigate(['/']);
        //this.showErrorMessage('unauthorised user');
        localStorage.clear();
      }

    }, error => {
      // this.loading = false;
      //this.showErrorMessage("You are not registered. Please contact admin");
      localStorage.clear();

    })
  }

  // getUserImage() {
  //   this.landingService.getPhoto().subscribe(result => {
  //     console.log(result)
  //   }

  //   )
  // }

  
}
