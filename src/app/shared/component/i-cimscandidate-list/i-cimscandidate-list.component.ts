import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-i-cimscandidate-list',
  templateUrl: './i-cimscandidate-list.component.html',
  styleUrls: ['./i-cimscandidate-list.component.scss']
})
export class ICIMSCandidateListComponent implements OnInit {
  @Input() data = [];
  constructor() { }

  ngOnInit() {
  }
  getAddress(address) {
    if(!!address) {
      return  address.map((r)=> {
        if(!!r.addressCountry) {
          return (r.addressCountry.value);
        }
        return [];        
        }).join(', ')
    }

return '';
  }

getPhoneNumber(phone) {
    if(!!phone) {
      return  phone.map((r)=> {
        if(!!r.phoneNumber) {
          return (r.phoneNumber);
        }
        return [];        
        }).join(', ')
    }

return '';
  }
}
