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
    MComponentInformation,
    MComponentHeaderColumn,
    MRecommendationInformation
} from '../../models/ui.model';

@Component({
    selector: 'component-information',
    styleUrls: ['./component-information.component.less'],
    templateUrl: './component-information.component.html'
})
export class ComponentInformationComponent implements OnInit, OnChanges {
    @Input() component: MComponentInformation | MRecommendationInformation;
    @Input() positions: Array<MComponentHeaderColumn>;
    @Input() serial: number;

    ngOnInit() {
        debugger;
        console.log(this.component);
        console.log(this.positions);
    }

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['component'];
        debugger;
        if (summary) {
            this.component = <MComponentInformation | MRecommendationInformation> summary.currentValue;
        }
        if (changes['positions']) {
            this.positions = changes['positions']['currentValue'];
        }
    }
}
