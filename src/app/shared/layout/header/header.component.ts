import { Component, OnInit, Input } from '@angular/core';
import { AdalService } from '../../services/adal.service';
@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 @Input() location;
  constructor(private adalService: AdalService) { }
  logout() {
    this.adalService.logout();
  }
  ngOnInit() {
   
  }

}
