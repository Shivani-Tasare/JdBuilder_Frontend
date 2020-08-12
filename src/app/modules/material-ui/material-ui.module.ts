import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatAutocompleteModule,
  MatInputModule,
  MatSelectModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatExpansionModule
} from '@angular/material';
const modules = [
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatMenuModule,
  MatAutocompleteModule,
  MatInputModule,
  MatSelectModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatExpansionModule
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    modules
  ],
  exports: modules,
})
export class MaterialUiModule { }
