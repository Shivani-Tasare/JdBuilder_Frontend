import { Component, OnInit } from '@angular/core';
import { SmartServiceService } from 'src/app/services/smart-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewresume-details',
  templateUrl: './viewresume-details.component.html',
  styleUrls: ['./viewresume-details.component.scss']
})
export class ViewresumeDetailsComponent implements OnInit {

  constructor(private smartService: SmartServiceService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      
    })

    this.smartService.getResumeDetails().subscribe(response => {

    })
  }

}
