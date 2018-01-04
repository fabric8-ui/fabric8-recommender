/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Vendor imports Go HERE */


import { ReportSummaryInfoEntriesComponent } from './report-info-entries/report-info-entries.component';
import { ReportSummaryContentComponent } from './report-summary-content.component';

const dependencies = [
    ReportSummaryInfoEntriesComponent
];

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ...dependencies,
        ReportSummaryContentComponent
    ],
    exports: [
        ReportSummaryContentComponent
    ]
})
export class ReportSummaryContentModule {}
