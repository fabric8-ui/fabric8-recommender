/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
/** Vendor imports Go HERE */

import {
    MReportInformation
} from '../../models/ui.model';

@Component({
    selector: 'report-information',
    styleUrls: ['./report-information.component.less'],
    templateUrl: './report-information.component.html'
})
export class ReportInformationComponent implements OnInit, OnChanges {
    @Input() report: MReportInformation;

    ngOnInit() {
        debugger;
    }

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['report'];
        debugger;
        if (summary) {
            this.report = <MReportInformation> summary.currentValue;
        }
    }
}
