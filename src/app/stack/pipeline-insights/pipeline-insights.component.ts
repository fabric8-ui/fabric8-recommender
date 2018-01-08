import { Component, Input, OnInit, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { getStackReportModel } from '../utils/stack-api-utils';
import { StackReportModel, ResultInformationModel, UserStackInfoModel,
    ComponentInformationModel, RecommendationsModel } from '../models/stack-report.model';
import { PipelineInsightsService } from './pipeline-insights.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'pipleine-insights-details',
    providers: [PipelineInsightsService],
    // encapsulation: ViewEncapsulation.None,
    styleUrls: ['./pipeline-insights.component.less'],
    templateUrl: './pipeline-insights.component.html'
})
@Injectable()
// export class UserService {
//   constructor (
    
//   ) {}

// }
export class PipelineInsightsComponent implements OnInit, OnChanges {
    // @Input() gatewayConfig: any;
    @Input() stack: string;
    @Input() buildNumber;
    @Input() appName;
    @Input() stackResponse;
    @Input() component;
    @Input() url: string;

    @ViewChild('stackModule') modalStackModule: any;

    public cve_Info: string;
    public stackUrl: string;
    public symbol: string = "pficon-error-circle-o";

    constructor(private PipelineInsightsService: PipelineInsightsService,
        private http: Http) {}
    
    
    public showStackModal(event: Event): void {
        event.preventDefault();
        this.modalStackModule.open();
    }

    public geturl():void {
        this.stackUrl = this.url;
        let observable: any = this  .PipelineInsightsService
                                    .getStackAnalyses(this.url);

        observable.subscribe((data) => {
            if(data) {
            console.log(data);
            // let cve: number = data.result.data[0].user_stack_info.analyzed_dependencies.data[0].security;
            let cve: string = data.result[0].user_stack_info.analyzed_dependencies[0].security;
            console.log("this is the cve value"+cve+" so");
            if(cve&&!" "){
                this.getcve(cve);
            }
            else {
                this.getcve('0');
            }
        }
        });
    }

    public getcve(data: string): void {
        this.cve_Info = data;
        if (this.cve_Info == '0') {
            this.symbol = "pficon-ok";
        }
        console.log("cve_info" + this.cve_Info)
    }
    

    ngOnInit(): void {
        // if (this.stack && this.stack !== '') {
        //     this.stackAnalysisService
        //         .getStackAnalyses(this.stack, this.gatewayConfig)
        //         .subscribe((data) => {
        //             this.handleResponse(data);
        //         },

        this.geturl();
    }

    ngOnChanges(): void {
        this.geturl();
    }

    
}
