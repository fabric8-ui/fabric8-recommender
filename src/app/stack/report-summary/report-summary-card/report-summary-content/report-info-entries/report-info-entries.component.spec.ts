import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';


import { ReportSummaryInfoEntriesComponent } from './report-info-entries.component';

describe ('ReportSummaryInfoEntriesComponent', () => {
    let component: ReportSummaryInfoEntriesComponent;
    let fixture: ComponentFixture<ReportSummaryInfoEntriesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ReportSummaryInfoEntriesComponent
            ],
            providers: [
                Http,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportSummaryInfoEntriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
