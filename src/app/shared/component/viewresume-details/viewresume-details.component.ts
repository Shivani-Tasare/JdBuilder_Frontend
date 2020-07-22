import { Component, OnInit, SecurityContext } from '@angular/core';
import { SmartServiceService } from 'src/app/services/smart-service.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-viewresume-details',
  templateUrl: './viewresume-details.component.html',
  styleUrls: ['./viewresume-details.component.scss']
})
export class ViewresumeDetailsComponent implements OnInit {
  id: String;
  name: string;
  resumeData = '';
  constructor(private smartService: SmartServiceService,private route: ActivatedRoute,
    private sanitizer: DomSanitizer) { 
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })
  }

  ngOnInit() {
        this.smartService.getResumeDetails(this.id).subscribe(response => {
          response !== "" ? this.resumeData = this.sanitizer.sanitize(SecurityContext.HTML, response.replace(/(?:\r\n|\r|\n)/g, '<br>')) :
          this.resumeData = "No resume available!"
    
    })
  }
}
