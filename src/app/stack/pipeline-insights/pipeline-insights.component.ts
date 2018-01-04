import { Component, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { getStackReportModel } from '../utils/stack-api-utils';
import { StackReportModel, ResultInformationModel, UserStackInfoModel,
    ComponentInformationModel, RecommendationsModel } from '../models/stack-report.model';
import { PipelineInsightsService } from './pipeline-insights.service';

@Component({
    selector: 'pipleine-insights-details',
    providers: [PipelineInsightsService],
    // encapsulation: ViewEncapsulation.None,
    styleUrls: ['./pipeline-insights.component.less'],
    templateUrl: './pipeline-insights.component.html'
})

export class PipelineInsightsComponent implements OnChanges {
    // @Input() gatewayConfig: any;
    @Input() stack: string;
    @Input() buildNumber;
    @Input() appName;
    @Input() stackResponse;

    @ViewChild('stackModule') modalStackModule: any;

    public cve_Info: number;


    public showStackModal(event: Event): void {
        event.preventDefault();
        this.modalStackModule.open();
    }

    public getcve(data: number): void {
        this.cve_Info = data;
    }

    ngOnChanges(): void {
        
    }

    constructor(private PipelineInsightsService: PipelineInsightsService) {}



    
}
