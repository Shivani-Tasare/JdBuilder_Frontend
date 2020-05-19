import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestedTagViewComponent } from './component/suggested-tag-view/suggested-tag-view.component';

@NgModule({
  declarations: [  SuggestedTagViewComponent ],
  exports: [ SuggestedTagViewComponent],
  imports: [
    CommonModule
  ],
})
export class SharedModule { }
