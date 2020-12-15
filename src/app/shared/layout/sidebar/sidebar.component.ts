import { Component, OnInit, Input } from '@angular/core';
import { JobServiceService } from '../../services/job-service.service';
import { Router } from '@angular/router';
import { AdalService } from '../../services/adal.service';
@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() location;
  isAdmin: boolean;
  constructor(private jobService: JobServiceService, router: Router,private adalService: AdalService) {
   }
  ngOnInit() {
    this.adalService.userInfo.userName == 'rapidadmin@dminc.com' ? this.isAdmin = true : this.isAdmin = false;

}
}