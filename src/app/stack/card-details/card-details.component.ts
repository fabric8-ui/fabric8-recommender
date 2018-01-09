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
    MTab
} from '../models/ui.model';

@Component({
    selector: 'card-details',
    styleUrls: ['./card-details.component.less'],
    templateUrl: './card-details.component.html'
})
export class CardDetailsComponent implements OnInit, OnChanges {
    @Input() details: MCardDetails;

    public tabs: MTab = null;

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

    }
}
