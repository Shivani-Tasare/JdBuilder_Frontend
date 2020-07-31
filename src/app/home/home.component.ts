import { Component, OnInit } from '@angular/core';
import { AdalService } from '../shared/services/adal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(private adalService: AdalService) { }
  logout() {
    this.adalService.logout();
  }

  ngOnInit() {
  }

}
