import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';

import { Logger } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';

import { Stack } from './../../../models/stack';
import { StackAnalysesService } from '../stack-analyses.service';
import { AddWorkFlowService } from './add-work-flow.service';

@Component({
  selector: 'stack-details',
  templateUrl: './stack-details.component.html',
  styleUrls: ['./stack-details.component.scss'],
  providers: [AddWorkFlowService,
    Logger,
    StackAnalysesService],
  encapsulation: ViewEncapsulation.None
})

export class StackDetailsComponent implements OnInit {

  @Input() stack: Stack;
  @ViewChild('stackModule') modalStackModule: any;

  errorMessage: any = {};
  stackAnalysesData: Array<any> = [];
  componentAnalysesData: any = {};
  mode = 'Observable';

  componentDataObject = {};
  componentsDataTable = [];

  currentIndex: number = 0;

  similarStacks: Array<any> = [];
  workItemRespMsg: string = '';

  workItemData: any = {};
  multilpeActionData: any = {};

  private stackAnalysisRawData: any = {};
  private recommendations: Array<any> = [];
  private dependencies: Array<any> = [];
  private stackOverviewData: any = {};

  constructor(
    private addWorkFlowService: AddWorkFlowService,
    private stackAnalysesService: StackAnalysesService,
    private logger: Logger
  ) { }

  ngOnInit() {
    this.getStackAnalyses(this.stack.uuid);
    this.stackOverviewData = {
      dependencyChart: [
        ['internal', 11],
        ['external', 21]
      ],
      compUsageChart: [
        ['in teams', 2],
        ['in organizations', 3]
      ],
      CVEdata: ['CVE-2014-0001', 'CVE-2014-12345', 'CVE-2013-78934']
    };
  }

  private setRecommendations(missing: Array<any>, version: Array<any>): void {
    this.recommendations = [];
    for (let i in missing) {
      if (missing.hasOwnProperty(i)) {
        this.recommendations.push({
          suggestion: 'Recommended',
          action: 'Add',
          message: i + ' ' + missing[i],
          pop: [
            {
              itemName: 'Create WorkItem',
              identifier: 'CREATE_WORK_ITEM'
            }, {
              itemName: 'Dismiss Recommendation',
              identifier: 'DISMISS'
            }, {
              itemName: 'Restore Recommendation',
              identifier: 'RESTORE'
            }
          ]
        });
      }
    }

    for (let i in version) {
      if (version.hasOwnProperty(i)) {
        this.recommendations.push({
          suggestion: 'Recommended',
          action: 'Upgrade',
          message: i + ' ' + version[i],
          pop: [
            {
              itemName: 'Create WorkItem',
              identifier: 'CREATE_WORK_ITEM'
            }, {
              itemName: 'Dismiss Recommendation',
              identifier: 'DISMISS'
            }, {
              itemName: 'Restore Recommendation',
              identifier: 'RESTORE'
            }
          ]
        });
      }
    }
  }

  private setDependencies(components: Array<any>): void {
    this.dependencies = components;
  }

  private setComponentsToGrid(stackData: any): void {
    let components: Array<any> = stackData.components;
    let length: number = components.length;
    for (let i = 0; i < length; i++) {
      let myObj: any = {};
      myObj.ecosystem = components[i].ecosystem;
      myObj.pkg = components[i].name;
      myObj.version = components[i].version;
      myObj.latestVersion = components[i].latest_version;
      myObj.publicUsage = components[i].dependents_count;
      myObj.relativePublicUsage = components[i].relative_usage;
      myObj.popularity = '';
      if (components[i].github_details.forks_count) {
        myObj.popularity = components[i].github_details.forks_count;
      }
      if (components[i].github_details.stargazers_count) {
        myObj.popularity += '/'
          + components[i].github_details.stargazers_count;
      }

      myObj.redhatUsage = '';
      myObj.licence = components[i].licenses[0];
      this.componentsDataTable.push(myObj);
    }
  }

  private getStackAnalyses(id: string) {
    let stackAnalysesData: any = {};
    this.stackAnalysesService
      .getStackAnalyses(id)
      .subscribe(data => {
        if (data && Object.keys(data).length !== 0) {
          stackAnalysesData = data;
          let result: any;
          let components: Array<any> = [];

          if (stackAnalysesData.hasOwnProperty('result') && stackAnalysesData.result.length > 0) {
            result = stackAnalysesData.result[0];
            if (result.hasOwnProperty('components')) {
              components = result.components;
              // Call the stack-components with the components information so that
              // It can parse the necessary information and show relevant things.
              this.setDependencies(components);
            }

            this.setComponentsToGrid(result);
          }
          if (stackAnalysesData.hasOwnProperty('recommendation')) {
            let recommendation: any = stackAnalysesData.recommendation.recommendations;
            if (recommendation) {
              this.similarStacks = recommendation.similar_stacks;
              const analysis: any = this.similarStacks[0].analysis;
              let missingPackages: Array<any> = analysis.missing_packages;
              let versionMismatch: Array<any> = analysis.version_mismatch;

              // Call the recommendations with the missing packages and version mismatches
              this.setRecommendations(missingPackages, versionMismatch);
            }
          }
        } else {
          this.errorMessage.message = `This could take a while. Return to pipeline to keep
           working or stay on this screen to review progress.`;
          this.errorMessage.stack = '';
        }
      },
      error => {
        this.errorMessage.message = <any>error.message;
        this.errorMessage.stack = <any>error.stack;
      }
      );
  }

  private showStackModal(event): void {
    this.modalStackModule.open();
    // TODO : below hack needs to be removed
    // This hack was introduced as c3's chart was not properly rendered on load
    // but on triggering some random changes works fine
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

}
