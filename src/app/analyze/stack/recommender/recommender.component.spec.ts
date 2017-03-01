/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { CommonModule } from '@angular/common';

import { AuthenticationService } from 'ngx-login-client';
import { recommenderApiUrlProvider } from './../../../shared/recommender-api.provider';
import { ApiLocatorService } from './../../../shared/api-locator.service';
import { witApiUrlProvider } from './../../../shared/wit-api.provider';

import { RecommenderComponent } from './recommender.component';
import { AddWorkFlowService } from '../stack-details/add-work-flow.service';

describe('StackRecommenderComponent', () => {
    let component: RecommenderComponent;
    let fixture: ComponentFixture<RecommenderComponent>;

    let recommendation: any = {
      suggestion: 'Recommended',
      action: 'Add',
      message: 'vertex-missing',
      isDismissed: true,
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
    };

    beforeEach(async(() => {
        let fakeAuthService: any = {
            getToken: function () {
                return '';
            },
            isLoggedIn: function () {
                return true;
            }
        };
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpModule
            ],
            declarations: [RecommenderComponent],
            providers: [AddWorkFlowService,
                {
                    provide: AuthenticationService,
                    useValue: fakeAuthService
                },
                witApiUrlProvider,
                recommenderApiUrlProvider,
                ApiLocatorService
            ]
        })
            .compileComponents();
    }));

    it('Component has to be present', () => {
        this.fixture = TestBed.createComponent(RecommenderComponent);
        component = this.fixture.componentInstance;
        this.fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    /* it('Should have recommendations as much as the input recommendations', async(() => {
        this.fixture = TestBed.createComponent(RecommenderComponent);
        const element: Element = this.fixture.nativeElement;
        const componentIns: any = this.fixture.componentInstance;
        componentIns.recommendations = [{
          suggestion: 'Recommended',
          action: 'Add',
          message: 'vertex-missing',
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
        }, {
          suggestion: 'Recommended',
          action: 'Upgrade',
          message: 'vertex-version-mismatch',
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
        }, {
          suggestion: 'Recommended',
          action: 'Add',
          message: 'vertex-missing',
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
        }];
        this.fixture.detectChanges();
        componentIns.ngOnChanges();
        console.log(element);
        console.log(element.querySelectorAll('recommendation-group-item'));
        expect(element.querySelectorAll('recommendation-group-item').length).toBe(this.fixture.componentInstance.recommendations.length + 1);
    })); */

    it('Should return true for creating work items', () => {
        const recommenderComponent: any = new RecommenderComponent(null);
        let recommendation: any = {
          suggestion: 'Recommended',
          action: 'Add',
          message: 'vertex-missing',
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
        };
        let flag: boolean = recommenderComponent.canCreateWorkItem(recommendation);
        expect(flag).toBe(true);
    });

    it('Should return false for creating work items', () => {
        const recommenderComponent: any = new RecommenderComponent(null);
        let flag: boolean = recommenderComponent.canCreateWorkItem(recommendation);
        expect(flag).toBe(false);
    });

    it('Should call toggleWorkItem function', () => {
      const recommenderComponent: any = new RecommenderComponent(null);
      spyOn(recommenderComponent, 'toggleWorkItem');
      recommenderComponent.handleDismissWorkItemAction([recommendation]);
      expect(recommenderComponent.toggleWorkItem).toHaveBeenCalled();
    });

    it('Should call handleRestoreWorkItemAction function', () => {
      const recommenderComponent: any = new RecommenderComponent(null);
      spyOn(recommenderComponent, 'toggleWorkItem');
      recommenderComponent.handleRestoreWorkItemAction([recommendation]);
      expect(recommenderComponent.toggleWorkItem).toHaveBeenCalled();
    });

    it('Should check if the recommendations have toggled properly for dismissWorkItemCase', () => {
      const recommenderComponent: any = new RecommenderComponent(null);
      let recommendations: Array<any> = [recommendation];
      let oldArray: Array<boolean> = [];
      for (let i in recommendations) {
        if (recommendations.hasOwnProperty(i)) {
          oldArray.push(recommendations[i].isDismissed);
        }
      }
      recommenderComponent.handleDismissWorkItemAction(recommendations);
      for (let i: number = 0; i < recommendations.length; ++ i) {
        if (recommendations.hasOwnProperty(recommendations[i])) {
          expect(!oldArray[i]).toBe(recommendations[i].isDismissed);
        }
      }
    });

    it('Should check if the recommendations have toggled properly for restoreWorkItemCase', () => {
      const recommenderComponent: any = new RecommenderComponent(null);
      let recommendations: Array<any> = [recommendation];
      let oldArray: Array<boolean> = [];
      for (let i in recommendations) {
        if (recommendations.hasOwnProperty(i)) {
          oldArray.push(recommendations[i].isDismissed);
        }
      }
      recommenderComponent.handleRestoreWorkItemAction(recommendations);
      for (let i: number = 0; i < recommendations.length; ++ i) {
        if (recommendations.hasOwnProperty(recommendations[i])) {
          expect(!oldArray[i]).toBe(recommendations[i].isDismissed);
        }
      }
    });

    /* it('The create work item button has to be disabled on load', () => {
        
    }); */
});
