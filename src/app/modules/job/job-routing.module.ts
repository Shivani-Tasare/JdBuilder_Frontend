import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobListingComponent } from './job-listing/job-listing.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
// import { CreateJdComponent } from "./create-jd/create-jd.component";
const routes: Routes = [
  // {path: '', component: JobListingComponent},
  {path: '', component: JobDetailComponent},
  // {path: 'createJD', component: CreateJdComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
