import { Component, OnInit } from '@angular/core';
import { SmartServiceService } from 'src/app/services/smart-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewresume-details',
  templateUrl: './viewresume-details.component.html',
  styleUrls: ['./viewresume-details.component.scss']
})
export class ViewresumeDetailsComponent implements OnInit {
  email: String;
  resumeData = 'Nothing to display!';
  constructor(private smartService: SmartServiceService,private route: ActivatedRoute) { 
    this.route.params.subscribe(params => {
      this.email = params['id'];
      console.log(params);
    })


  }

  ngOnInit() {
        this.smartService.getResumeDetails(this.email).subscribe(response => {
            this.resumeData = response;
    })
  }

}
