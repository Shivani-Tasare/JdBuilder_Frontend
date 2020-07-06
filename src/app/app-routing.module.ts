import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { JobListingComponent } from './modules/job/job-listing/job-listing.component';
import { CreateJdComponent } from './modules/job/create-jd/create-jd.component';
import { JdsSharedComponent } from './modules/job/jds-shared/jds-shared.component';
import { ViewresumeDetailsComponent } from './shared/component/viewresume-details/viewresume-details.component';

const routes: Routes = [
  {path: '', redirectTo: 'allJd', pathMatch: 'full'},
  {path: 'allJd/job-description/view/:jobId', loadChildren: './modules/job/job.module#JobModule'},
  {path: 'myJd/job-description/view/:jobId', loadChildren: './modules/job/job.module#JobModule'},
  {path: 'jd/job-description/edit/:jobId', loadChildren: './modules/job/job.module#JobModule'},
  {path: 'createJD', component: CreateJdComponent},
  {path: 'allJd', component: JobListingComponent},
  {path: 'jdsShared', component: JdsSharedComponent},
  {path: 'myJd', component: JobListingComponent},
  {path: 'view-resume/:id', component: ViewresumeDetailsComponent},
  {path: '**', component: PageNotFoundComponent}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
