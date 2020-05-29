import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { JobListingComponent } from './modules/job/job-listing/job-listing.component';
import { CreateJdComponent } from './modules/job/create-jd/create-jd.component';
import { JdsSharedComponent } from './modules/job/jds-shared/jds-shared.component';
import { JobDetailEditModeComponent } from './modules/job/job-detail-edit-mode/job-detail-edit-mode.component';
import { JobDetailComponent } from './modules/job/job-detail/job-detail.component';
import { ViewCandidatesPieChartComponent } from './modules/job/view-candidates-pie-chart/view-candidates-pie-chart.component';

const routes: Routes = [
  {path: '', redirectTo: 'allJd', pathMatch: 'full'},
  {path: 'allJd/job-description/view/:jobId', component: JobDetailComponent},
  {path: 'myJd/job-description/view/:jobId', component: JobDetailComponent},
  {path: 'jd/job-description/edit/:jobId', component: JobDetailEditModeComponent},
  {path: 'viewCandidates', component: ViewCandidatesPieChartComponent},
  {path: 'createJD', component: CreateJdComponent},
  {path: 'allJd', component: JobListingComponent},
  {path: 'jdsShared', component: JdsSharedComponent},
  {path: 'myJd', component: JobListingComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
