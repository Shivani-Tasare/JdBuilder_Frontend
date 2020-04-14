import { Component, OnInit } from '@angular/core';
import { AdalService } from '../../services/adal.service';
@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private adalService: AdalService) { }
  logout() {
    console.log('function called')
    this.adalService.logout();
  }
  ngOnInit() {
  }

}
