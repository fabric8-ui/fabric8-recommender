/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
/** Vendor imports Go HERE */

import {
    MCardDetails
} from '../models/ui.model';

@Component({
    selector: 'card-details',
    styleUrls: ['./card-details.component.less'],
    templateUrl: './card-details.component.html'
})
export class CardDetailsComponent implements OnChanges {
    @Input() details: MCardDetails;

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['details'];
        if (summary) {
            this.details = <MCardDetails> summary.currentValue;
        }
    }
}
