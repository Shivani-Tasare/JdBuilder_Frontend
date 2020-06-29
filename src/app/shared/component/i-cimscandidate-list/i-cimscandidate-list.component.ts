import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-i-cimscandidate-list',
  templateUrl: './i-cimscandidate-list.component.html',
  styleUrls: ['./i-cimscandidate-list.component.scss']
})
export class ICIMSCandidateListComponent implements OnInit {
  //@Input() data = [];
  @Input() data = {Total: null, CandidateList: []};
  constructor() { }

  ngOnInit() {
  }
  getAddress(address) {
    if(!!address) {
      return  address.map((r)=> {
        if(!!r.AddressCountry) {
          return (r.AddressCountry.Value);
        }
        return [];        
        }).join(', ')
    }

return '';
  }

getPhoneNumber(phone) {
    if(!!phone) {
      return  phone.map((r)=> {
        if(!!r.PhoneNumber) {
          return (r.PhoneNumber);
        }
        return [];        
        }).join(', ')
    }

return '';
  }
}
