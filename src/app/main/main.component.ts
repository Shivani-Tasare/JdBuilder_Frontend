import { Component, Inject, OnInit, HostListener,ElementRef} from '@angular/core';
import { AdalService } from '../shared/services/adal.service';
import { APP_CONFIG, AppConfig } from '../config/config';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { JobServiceService } from '../shared/services/job-service.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  location = false;
  title = 'jobProject';
  isHome = false;
  isAuthenticated = false;
  subscription: Subscription;
  isCollapseOn = false;
  selectedIndex = 2
  mobileView: boolean;
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
  constructor(private jobService:JobServiceService, private eRef: ElementRef, private adalService: AdalService, @Inject(APP_CONFIG) private config: AppConfig, private router: Router) {
    router.events.subscribe(val => {
      if (location.pathname.indexOf("home") > 0) {
        this.isHome = true;
        this.location = false;
      }
      if (location.pathname.indexOf("myJd") > 0) {
        this.selectedIndex = 2;
        this.location = false;
      }
      if (location.pathname.indexOf("allJd") > 0) {
        this.selectedIndex = 1;
        this.location = false;
      }
      if(location.pathname.indexOf("jdsShared") > 0){
        this.location = false;
      }
      if(location.pathname.indexOf("help") > 0){
        this.location = true;
      }  
    });
   }
  get isHomeCheck() {
    return  this.isHome;
  } 
  ngOnInit() {;
    this.adalService.handleCallback();
   
    this.subscription = this.adalService.getUserAuthenticationStatus().subscribe(value => {
      if (value) {
        this.isAuthenticated = value;
      } else {
        
        this.isAuthenticated = value;
      }
    });
    this.adalService.acquireTokenResilient(this.config.resource).subscribe((token) => {
      
    });
    var title = document.querySelector('title')
    location.pathname.includes('jd-creator') ? title.text = 'JD Creator' : title.text = 'RAPID'; 
  }
  

}
