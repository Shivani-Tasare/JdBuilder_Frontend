import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(public loaderService: LoaderService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(req, 'interdceptor reqpuest');
        this.loaderService.show();
        return next.handle(req).pipe(
            finalize(() => this.loaderService.hide())
        );
    }
}
