import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JobRoutingModule } from './job-routing.module';
import { JobListingComponent } from './job-listing/job-listing.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { Job1ServiceService } from './job-service.service';
import {
  // MatChipsModule,
  // MatFormFieldModule,
  // MatIconModule,
  // MatAutocompleteModule,
  // MatInputModule,
  // MatSelectModule,
  // MatPaginatorModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { MaterialUiModule } from '../material-ui/material-ui.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { ViewJdComponent } from './view-jd/view-jd.component';
import { ChartsModule } from 'ng2-charts';
import { PipesModule } from 'src/app/shared/pipes/jobId-pipe/pipe.module';
import { CreateJdComponent } from './create-jd/create-jd.component';
import { ContentPdfComponent } from './content-pdf/content-pdf.component';
@NgModule({
  declarations: [
    // JobListingComponent,
    JobDetailComponent,
    ViewJdComponent,
    ContentPdfComponent,
    // CreateJdComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    JobRoutingModule,
    MaterialUiModule,
    MatProgressSpinnerModule,
    NgxPaginationModule,
    ChartsModule,
    PipesModule
  ],
  providers: [Job1ServiceService]
})
export class JobModule { }
