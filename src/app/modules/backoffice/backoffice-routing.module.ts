import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackofficeIndexComponent } from './backoffice-index/backoffice-index.component';
import { DesignationIndexComponent } from './designation-index/designation-index.component';
import { ExperienceIndexComponent } from './experience-index/experience-index.component';

const routes: Routes = [
  {path: '', component: BackofficeIndexComponent, pathMatch: 'full'},
  {path:'designations', component:DesignationIndexComponent, pathMatch:'full'},
  {path:'experience', component:ExperienceIndexComponent, pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }