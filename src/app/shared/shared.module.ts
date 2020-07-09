import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestedTagViewComponent } from './component/suggested-tag-view/suggested-tag-view.component';
import { ICIMSCandidateListComponent } from './component/i-cimscandidate-list/i-cimscandidate-list.component';
import { ViewresumeDetailsComponent } from './component/viewresume-details/viewresume-details.component';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [  SuggestedTagViewComponent, ICIMSCandidateListComponent, ViewresumeDetailsComponent],
  exports: [ SuggestedTagViewComponent, ICIMSCandidateListComponent, ViewresumeDetailsComponent],
  imports: [
    CommonModule,RouterModule,
    ChartsModule
  ],
})
export class SharedModule { }
