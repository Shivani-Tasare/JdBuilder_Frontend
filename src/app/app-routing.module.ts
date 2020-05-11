import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { JobListingComponent } from './modules/job/job-listing/job-listing.component';
import { CreateJdComponent } from './modules/job/create-jd/create-jd.component';
import { JdsSharedComponent } from './modules/job/jds-shared/jds-shared.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {path: '', redirectTo: 'allJd', pathMatch: 'full', canActivate: [MsalGuard]},
  {path: 'allJd/job-description/view/:jobId',canLoad: [MsalGuard], loadChildren: './modules/job/job.module#JobModule'},
  {path: 'myJd/job-description/view/:jobId',canLoad: [MsalGuard], loadChildren: './modules/job/job.module#JobModule'},
  {path: 'jd/job-description/edit/:jobId',canLoad: [MsalGuard], loadChildren: './modules/job/job.module#JobModule'},
  {path: 'createJD', component: CreateJdComponent, canActivate: [MsalGuard]},
  {path: 'allJd', component: JobListingComponent, canActivate: [MsalGuard]},
  {path: 'jdsShared', component: JdsSharedComponent, canActivate: [MsalGuard]},
  {path: 'myJd', component: JobListingComponent, canActivate: [MsalGuard]},
  {path: '**', component: PageNotFoundComponent, canActivate: [MsalGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
