import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(public loaderService: LoaderService) { }
    private totalRequest = 0;
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.totalRequest++;
        this.loaderService.show();
        return next.handle(req).pipe(
            finalize(() =>{
                this.totalRequest--;
                if(this.totalRequest === 0){
                    this.loaderService.hide()
                }
            })
        )
    }
}
