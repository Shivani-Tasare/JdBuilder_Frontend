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
  email: String;
  name: string;
  resumeData = 'Nothing to display!';
  constructor(private smartService: SmartServiceService,private route: ActivatedRoute,
    private sanitizer: DomSanitizer) { 
    this.route.params.subscribe(params => {
      this.email = params['id'];
      console.log(params);
    })


  }

  ngOnInit() {
        this.smartService.getResumeDetails(this.email).subscribe(response => {
        this.name = response.substr(0, response.indexOf('Phone:')).replace('"','');
        response = response.substr(response.indexOf('Phone:'), response.length);  
        let tags = {

          'Phone:' : `<h5 style="color:red">PHONE:</h5>`, 
          'Email:' : '<br/><br/><h5>EMAIL:</h5>',
          'WORK EXPERIENCE:' : '<br/><br/><h5>WORK EXPERIENCE:</h5>',
          'PROJECTS:': '<br/><br/><h5>PROJECTS:</h5>',
          'TECHNICAL SKILLS:' : '<br/><br/><h5>TECHNICAL SKILLS:</h5>',
          'EDUCATION:': '<br/><br/><h5>EDUCATION:</h5>',
          'COURSES:' : '<br/><br/><h5>COURSES:</h5>'};

            response = response.replace(/Phone:|Email:|WORK EXPERIENCE:|PROJECTS:|TECHNICAL SKILLS:|EDUCATION:|COURSES:/gi, 
              (m:any)=>{
                return tags[m];
            })


        this.resumeData = this.sanitizer.sanitize(SecurityContext.HTML, response)
    })
  }

}
