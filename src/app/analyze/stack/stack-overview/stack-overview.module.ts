import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseDirective } from 'ng2-bootstrap/ng2-bootstrap';

import { StackDetailsModule } from './../stack-details/stack-details.module';
import { StackOverviewComponent } from './stack-overview.component';

@NgModule({
  imports: [
    CommonModule,
    StackDetailsModule],
  declarations: [StackOverviewComponent, CollapseDirective]
})
export class StackOverviewModule {
  constructor() { }
}
