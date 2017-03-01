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
        fixture = TestBed.createComponent(RecommenderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
