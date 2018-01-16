import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';

import { MReportSummaryTitle } from '../../../models/ui.model';
import { ReportSummaryTitleComponent } from './report-summary-title.component';

describe ('ReportSummaryTitleComponent', () => {
    let component: ReportSummaryTitleComponent;
    let fixture: ComponentFixture<ReportSummaryTitleComponent>;

    let title = new MReportSummaryTitle();
    title.notificationIcon = 'icon-notification';
    title.notificationIconBgColor = '#000000';
    title.titleIcon = 'icon-title';
    title.titleText = 'Title Text';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ReportSummaryTitleComponent
            ],
            providers: [
                Http,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportSummaryTitleComponent);
        component = fixture.componentInstance;
        component.title = title;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('check if the input received is of the type MReportSummaryTitle', () => {
        expect(component.title instanceof MReportSummaryTitle).toBeTruthy();
    });
});
