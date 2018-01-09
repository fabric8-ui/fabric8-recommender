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
    MCardDetails,
    MReportInformation,
    MTab
} from '../models/ui.model';

@Component({
    selector: 'card-details',
    styleUrls: ['./card-details.component.less'],
    templateUrl: './card-details.component.html'
})
export class CardDetailsComponent implements OnInit, OnChanges {
    @Input() details: MCardDetails;

    public tabs: Array<MTab> = [];

    ngOnInit() {
        this.paint();
    }

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['details'];
        if (summary) {
            this.details = <MCardDetails> summary.currentValue;
            this.paint();
        }
    }

    private paint(): void {
        this.tabs = [];
        debugger;
        if (this.details) {
            if (this.details.reportInformations && this.details.reportInformations.length > 1) {
                this.details.reportInformations.forEach((report: MReportInformation) => {
                    this.tabs.push(new MTab(
                        report.name,
                        report
                    ));
                });
            }
        }
    }
}
