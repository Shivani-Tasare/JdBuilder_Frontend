import { NgModule } from "@angular/core";
import { JobIdPipe } from './job-id.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [JobIdPipe],
  imports: [CommonModule],
  exports: [JobIdPipe]
})
export class PipesModule {}
