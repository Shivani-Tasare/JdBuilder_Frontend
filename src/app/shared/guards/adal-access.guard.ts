import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import { AdalService } from '../services/adal.service';
import { Observable } from 'rxjs';

@Injectable()
export class AdalAccessGuard implements CanActivate {
    constructor(private router: Router, private adalService: AdalService) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.log(this.adalService.userInfo);
        const navigationExtras: NavigationExtras = {
            queryParams: { redirectUrl: route.url }
        };
        if (!this.adalService.userInfo) {
            this.router.navigate(['accessdenied'], navigationExtras);
        }
        else if(this.adalService.userInfo.userName !== 'rapidadmin@dminc.com'){
            return false;
        }

        return true;
    }
}
