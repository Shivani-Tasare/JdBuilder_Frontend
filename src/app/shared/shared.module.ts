import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestedTagViewComponent } from './component/suggested-tag-view/suggested-tag-view.component';
import { ICIMSCandidateListComponent } from './component/i-cimscandidate-list/i-cimscandidate-list.component';

@NgModule({
  declarations: [  SuggestedTagViewComponent, ICIMSCandidateListComponent ],
  exports: [ SuggestedTagViewComponent, ICIMSCandidateListComponent],
  imports: [
    CommonModule
  ],
})
export class SharedModule { }
