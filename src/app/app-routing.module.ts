import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { JobListingComponent } from './modules/job/job-listing/job-listing.component';
import { CreateJdComponent } from './modules/job/create-jd/create-jd.component';

const routes: Routes = [
  {path: '', redirectTo: 'myJd', pathMatch: 'full'},
  // {path: 'job', loadChildren: './modules/job/job.module#JobModule'},
  {path: 'allJd/job-description/:jobId', loadChildren: './modules/job/job.module#JobModule'},
  {path: 'myJd/job-description/:jobId', loadChildren: './modules/job/job.module#JobModule'},
  // {path: 'createJD', loadChildren: './modules/job/job.module#JobModule'},
  {path: 'createJD', component: CreateJdComponent},
  {path: 'allJd', component: JobListingComponent},
  {path: 'myJd', component: JobListingComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
