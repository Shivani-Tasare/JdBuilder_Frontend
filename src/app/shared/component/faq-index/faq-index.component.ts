import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq-index',
  templateUrl: './faq-index.component.html',
  styleUrls: ['./faq-index.component.scss']
})
export class FAQIndexComponent implements OnInit {
  panelOpenState = false;
  constructor() { }

  ngOnInit() {
  }
  scrolltoDiv(id){
    id === 'search_anchor' ? document.getElementById('search').scrollIntoView({behavior : "smooth"}) : null ;
    id === 'designation_anchor' ? document.getElementById('designation').scrollIntoView({behavior : "smooth"}) : null ;
    id === 'dashboard_anchor' ? document.getElementById('dashboard').scrollIntoView({behavior : "smooth"}) : null ;
    id === 'experience_anchor' ? document.getElementById('experience').scrollIntoView({behavior : "smooth"}) : null ;
    id === 'create_anchor' ? document.getElementById('createdby').scrollIntoView({behavior : "smooth"}) : null ;
    id === 'location_anchor' ? document.getElementById('location').scrollIntoView({behavior : "smooth"}) : null ;
    id === 'newJD_anchor' ? document.getElementById('newJd').scrollIntoView({behavior : "smooth"}) : null ;
    id === 'myJd_anchor' ? document.getElementById('myJD').scrollIntoView({behavior : "smooth"}) : null ;
    id === 'sharedJD_anchor' ? document.getElementById('sharedjd').scrollIntoView({behavior : "smooth"}) : null ;
    id === 'EditJD_anchor' ? document.getElementById('editJD').scrollIntoView({behavior : "smooth"}) : null ;
    // id === 'Ipool_anchor' ? document.getElementById('dashboard').scrollIntoView({behavior : "smooth"}) : null ;
    // id === 'Epool_anchor' ? document.getElementById('dashboard').scrollIntoView({behavior : "smooth"}) : null ;
     id === 'login_A' ? document.getElementById('login').scrollIntoView({behavior : "smooth"}) : null ;
    // id === 'dashboard_anchor' ? document.getElementById('dashboard').scrollIntoView({behavior : "smooth"}) : null ;
    

  }
}
