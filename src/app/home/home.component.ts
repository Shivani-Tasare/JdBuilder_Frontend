import { Component, OnInit, Inject } from '@angular/core';
import { AdalService } from '../shared/services/adal.service';
import { APP_CONFIG, AppConfig } from '../config/config'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isAuthenticated = false;
  constructor(private adalService: AdalService,
    @Inject(APP_CONFIG) private config: AppConfig) {}

  logout() {
    this.adalService.logout();
  }

  ngOnInit() {
    this.adalService.handleCallback();
    this.adalService.getUserAuthenticationStatus().subscribe(value => {
      if (value) {
        this.isAuthenticated = value;
      } else {
        
        this.isAuthenticated = value;
      }
    });
    this.adalService.acquireTokenResilient(this.config.resource).subscribe((token) => {
    });
  }

}
