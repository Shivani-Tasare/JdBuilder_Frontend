import { Component, OnInit } from '@angular/core';
import { JobServiceService } from '../../services/job-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  selectedIndex = location.pathname === '/myJd' ? 2: 1;
  constructor(private jobService: JobServiceService, router: Router) {
    router.events.subscribe(val => {
      if (location.pathname.indexOf("myJd")>0) {
        this.selectedIndex = 2;
      }
      if (location.pathname.indexOf("allJd")>0) {
        this.selectedIndex = 1;
      }
    });
   }
  ngOnInit() {
    console.log(this.selectedIndex,'slecttt')
    // this.jobService.getSideBarIndex().subscribe((sidebarIndex)=>{
    //   this.selectedIndex = sidebarIndex
    // })
  }
  // activateClass(index){
  //   this.jobService.changeSideBarIndex(index)
  // }
}
