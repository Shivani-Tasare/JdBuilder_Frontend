import { Component, OnInit } from '@angular/core';
import { JobServiceService } from '../../services/job-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor(private jobService: JobServiceService, router: Router) {
   }
  ngOnInit() {
}
}