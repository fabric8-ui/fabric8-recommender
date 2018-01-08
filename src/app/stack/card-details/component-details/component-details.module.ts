/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Vendor imports Go HERE */

import { ProgressMeterModule } from '../../utils/progress-meter/progress-meter.module';

import { ComponentInformationComponent } from '../component-information/component-information.component';
import { ComponentDetailsComponent } from './component-details.component';

const components = [
    ComponentInformationComponent,
    ComponentDetailsComponent
];

@NgModule({
    imports: [
        CommonModule,
        ProgressMeterModule
    ],
    declarations: [
        ...components
    ],
    exports: [
        ...components
    ]
})
export class ComponentDetailsModule {}
