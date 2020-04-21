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
import { Config, APP_CONFIG } from './config/config';
import { AdalService } from './shared/services/adal.service';
import { AdalConfigService } from './shared/services/adal-config.service';
import { InsertAuthTokenInterceptor } from './shared/interceptors/insert-auth-token';
import { JobListingComponent } from './modules/job/job-listing/job-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './shared/pipes/jobId-pipe/pipe.module';
import { LayoutModule } from './shared/layout/layout.module';
import { CreateJdComponent } from './modules/job/create-jd/create-jd.component';
import { MaterialUiModule } from './modules/material-ui/material-ui.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoaderComponent,
    JobListingComponent,
    CreateJdComponent
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
  ],
  providers: [JobServiceService, LoaderService, AdalService, AdalConfigService,
    { provide: HTTP_INTERCEPTORS, useClass: InsertAuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },

    { provide: APP_CONFIG, useValue: {
      apiEndpoint: Config.url,
      clientId: Config.clientID,
      resource: Config.webClientId,
      tenantId: Config.tenantID,
      redirectUri: 'http://localhost:4200'
      //redirectUri: 'https://jdbuilderuatweb.azurewebsites.net'
    }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
