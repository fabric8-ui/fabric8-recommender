import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StackDetailsComponent } from './stack-details.component';

import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-modal';
import { TabsModule, AccordionModule } from 'ngx-bootstrap';

import { GlobalConstants } from '../constants/constants.service';

/** New UX */
// import {StackLevelModule} from '../stack-level/stack-level.module';
// import {ComponentLevelModule} from '../component-level/component-level.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { PipelineInsightsModule } from '../pipeline-insights/pipeline-insights.module';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService, AUTH_API_URL, SSO_API_URL } from 'ngx-login-client';

import { witApiUrlProvider } from '../../shared/wit-api.provider';
import { ApiLocatorService } from '../../shared/api-locator.service';
import { authApiUrlProvider } from '../../shared/auth-api.provider';
import { ssoApiUrlProvider } from '../../shared/sso-api.provider';
import { realmProvider } from '../../shared/realm-token.provider';
import { MockAuthenticationService } from '../../shared/mock-auth.service';

/** Stack Report Revamp - Latest */
import { ReportSummaryModule } from '../report-summary/report-summary.module';
import { CardDetailsModule } from '../card-details/card-details.module';
import { CommonService } from '../utils/common.service';
/** Stack Report Revamp - Latest */

const revampImports = [
  ReportSummaryModule,
  CardDetailsModule
];

describe ('StackDetailsComponent', () => {
    let component: StackDetailsComponent;
    let fixture: ComponentFixture<StackDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpModule,
                FormsModule,
                ModalModule,
                // StackLevelModule,
                // ComponentLevelModule,
                FeedbackModule,
                PipelineInsightsModule,
                AccordionModule.forRoot(),
                TabsModule.forRoot(),
                ...revampImports
            ],
            declarations: [
                StackDetailsComponent
            ],
            providers: [
                Broadcaster,
                ApiLocatorService,
                witApiUrlProvider,
                authApiUrlProvider,
                ssoApiUrlProvider,
                realmProvider,
                {
                    provide: AuthenticationService, useClass: MockAuthenticationService
                },
                Contexts,
                CommonService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StackDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
