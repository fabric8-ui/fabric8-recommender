import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StackDetailsComponent } from './stack-details/stack-details.component';

import { StackComponent } from './stack.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pmuir/BalloonPopGame/stack',
    pathMatch: 'full'
  },
  {
    path: '',
    component: StackComponent,
    children: [
      {
        path: '',
        component: StackDetailsComponent
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StackRoutingModule { }
