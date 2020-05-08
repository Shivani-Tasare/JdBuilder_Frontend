import { BrowserModule } from '@angular/platform-browser';
import { NgModule, } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { JobServiceService } from './shared/services/job-service.service';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './shared/layout/header/header.component';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderService } from './shared/services/loader.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './shared/interceptors/loader.interceptors';
import { LoaderComponent } from './shared/loader/loader.component';
import {
  MatProgressSpinnerModule
} from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import {NgxPaginationModule} from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';
import { Config } from './config/config';
import { InsertAuthTokenInterceptor } from './shared/interceptors/insert-auth-token';
import { JobListingComponent } from './modules/job/job-listing/job-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './shared/pipes/jobId-pipe/pipe.module';
import { LayoutModule } from './shared/layout/layout.module';
import { CreateJdComponent } from './modules/job/create-jd/create-jd.component';
import { MaterialUiModule } from './modules/material-ui/material-ui.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { JdsSharedComponent } from './modules/job/jds-shared/jds-shared.component';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
export const protectedResourceMap:[string, string[]][]= [
  ['https://buildtodoservice.azurewebsites.net/api/todolist', [ 'api://e98d88d4-0e9a-47f3-bddf-568942eac4e9/api.consume']],
  ['https://graph.microsoft.com/v1.0/me', ['user.read']]
];

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoaderComponent,
    JobListingComponent,
    CreateJdComponent,
    JdsSharedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    ChartsModule,
    FormsModule,
    PipesModule,
    LayoutModule,
    ReactiveFormsModule,
    MaterialUiModule,
    InfiniteScrollModule,
    MsalModule.forRoot({
      auth: {
        clientId: '55f3d986-c18e-4b43-b244-dd06909efe67',
        authority: "https://login.microsoftonline.com/db7ac9ef-779d-46e5-9bca-00509580ad6b",
        redirectUri: window.location.origin,

      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // set to true for IE 11
      },
    },
    {
      popUp: !isIE,
      consentScopes: [
        'user.read',
        'openid',
        'api://e98d88d4-0e9a-47f3-bddf-568942eac4e9/api.consume'
      ],
      unprotectedResources: [],
      protectedResourceMap: protectedResourceMap,
      extraQueryParameters: {}
    })
  ],
  providers: [JobServiceService, LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: InsertAuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
