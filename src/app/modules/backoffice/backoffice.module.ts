import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeIndexComponent } from './backoffice-index/backoffice-index.component';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { DesignationIndexComponent } from './designation-index/designation-index.component';
import { MaterialUiModule } from '../material-ui/material-ui.module';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { FormsModule } from '@angular/forms';
import { ExperienceIndexComponent } from './experience-index/experience-index.component';

@NgModule({
  declarations: [
    BackofficeIndexComponent,
    DesignationIndexComponent,
    ConfirmationPopupComponent,
    ExperienceIndexComponent
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    MaterialUiModule,
    FormsModule
  ],
  entryComponents:[
    ConfirmationPopupComponent
  ]
})
export class BackofficeModule { }
