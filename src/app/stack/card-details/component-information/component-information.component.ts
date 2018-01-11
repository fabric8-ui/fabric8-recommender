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
    public comp: MComponentInformation;
    @Input() serial: number;
    @Input() type: string;

    public paint(): void {
        if (this.component) {
            if (this.type === 'recommendation') {
                let c = (<MRecommendationInformation>this.component);
                this.comp = c && c.componentInformation;
            } else {
                this.comp = <MComponentInformation>this.component;
            }
        }
        console.log(this.comp);
    }

    ngOnInit() {
        this.paint();
    }

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['component'];
        if (summary) {
            this.component = <MComponentInformation | MRecommendationInformation> summary.currentValue;
        }
        if (changes['positions']) {
            this.positions = changes['positions']['currentValue'];
        }
        this.paint();
    }
}
