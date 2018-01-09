import { Component, Input, OnInit, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { getStackReportModel } from '../utils/stack-api-utils';
import {
    StackReportModel, ResultInformationModel, UserStackInfoModel,
    ComponentInformationModel, RecommendationsModel
} from '../models/stack-report.model';
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
    public flag: boolean = false;
    public flag1: boolean = false;
    
    constructor(private PipelineInsightsService: PipelineInsightsService,
        private http: Http) { }


    public showStackModal(event: Event): void {
        event.preventDefault();
        this.modalStackModule.open();
    }

    public geturl(): void {
        this.stackUrl = this.url;
        let observable: any = this.PipelineInsightsService
            .getStackAnalyses(this.url);

        observable.subscribe((data) => {
            if (data) {
                console.log(data);
                // let cve: string = data.result[0].user_stack_info.analyzed_dependencies[2].security.CVSS;console.log("cvss"+data.result[0].user_stack_info.analyzed_dependencies[2].security[0].CVSS);
                for (let i = 0; i < data.result.length; ++i) {
                    let c = data.result[i];
                    if (c.user_stack_info) {
                        if (c.user_stack_info.analyzed_dependencies) {
                            for (let j = 0; j < c.user_stack_info.analyzed_dependencies.length; ++j) {
                                let d = c.user_stack_info.analyzed_dependencies[j];
                                if (d.security && d.security.length > 0) {
                                    this.flag = true;
                                    break;
                                }
                            }
                        }
                    }

                }
                for (let i = 0; i < data.result.length; ++i) {
                    let c = data.result[i];
                    if (c.user_stack_info) {
                        if (c.user_stack_info.license_analysis) {console.log("liscense"+c.user_stack_info.license_analysis.length);
                            // for (let j = 0; j < Object.keys(c.user_stack_info.license_analysis).length; ++j) {
                                let d = c.user_stack_info.license_analysis.conflict_packages;
                                console.log("d value"+d);
                                if (d.length > 0) {
                                    this.flag1 = true;
                                    break;
                                }
                                d = c.user_stack_info.license_analysis.unknown_licenses;
                                console.log("d value"+d);
                                if (Object.keys(d).length > 0) {
                                    this.flag1 = true;
                                    break;
                                }
                            // }
                        }
                    }

                }
            }
        });

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
