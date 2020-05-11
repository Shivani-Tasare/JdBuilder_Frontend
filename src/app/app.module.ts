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
import { Config, ADConfig } from './config/config';
import { InsertAuthTokenInterceptor } from './shared/interceptors/insert-auth-token';
import { JobListingComponent } from './modules/job/job-listing/job-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './shared/pipes/jobId-pipe/pipe.module';
import { LayoutModule } from './shared/layout/layout.module';
import { CreateJdComponent } from './modules/job/create-jd/create-jd.component';
import { MaterialUiModule } from './modules/material-ui/material-ui.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { JdsSharedComponent } from './modules/job/jds-shared/jds-shared.component';
import {
  MsalModule,
  MsalInterceptor,
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR,
  MsalService,
  MsalAngularConfiguration
} from '@azure/msal-angular';
import { Configuration, CacheLocation } from 'msal';
export const protectedResourceMap: [string, string[]][] = [
  [ADConfig.resources.Api.resourceUri, [ADConfig.resources.Api.resourceScope]]
];

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
function MSALConfigFactory(): Configuration {
  return {
    auth: {
      clientId: ADConfig.auth.clientId,
      authority: ADConfig.auth.authority,
      validateAuthority: true,
      redirectUri: ADConfig.auth.redirectUri,
      postLogoutRedirectUri: ADConfig.auth.postLogoutRedirectUri,
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: <CacheLocation>ADConfig.cache.cacheLocation,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
  };
}

function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return {
    popUp: !isIE,
    consentScopes: [
      ADConfig.resources.Api.resourceScope,
      ...ADConfig.scopes.loginRequest
    ],
    unprotectedResources: [],
    protectedResourceMap,
    extraQueryParameters: {}
  };
}
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
    MsalModule
  ],
  providers: [JobServiceService, LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_CONFIG,
      useFactory: MSALConfigFactory
    },
    {
      provide: MSAL_CONFIG_ANGULAR,
      useFactory: MSALAngularConfigFactory
    },
    MsalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
