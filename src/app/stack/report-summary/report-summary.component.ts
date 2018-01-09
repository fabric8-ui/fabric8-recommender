/** Vendor imports Go HERE */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';
/** Vendor imports Go HERE */

import {
    ResultInformationModel,
    SecurityInformationModel,
    RecommendationsModel,
    ComponentInformationModel,
    StackLicenseAnalysisModel,
    UserStackInfoModel,
    GithubModel,
    OutlierInformationModel
} from '../models/stack-report.model';

import {
    MReportSummaryCard,
    MReportSummaryContent,
    MReportSummaryInfoEntry,
    MReportSummaryTitle,
    MCardDetails,
    MComponentHeaderColumn,
    MReportInformation,
    MComponentDetails,
    MComponentInformation,
    MRecommendationInformation,
    MSecurityDetails,
    MSecurityIssue,
    MCrowdSourcing,
    MGithub,
    MOsio,
    MProgressMeter
} from '../models/ui.model';
import { ReportSummaryUtils } from '../utils/report-summary-utils';

@Component({
    selector: 'analytics-report-summary',
    styleUrls: ['./report-summary.component.less'],
    templateUrl: './report-summary.component.html'
})
export class ReportSummaryComponent implements OnInit, OnChanges {
    @Input() report: ResultInformationModel;
    @Output('onCardClick') onCardClick = new EventEmitter<MCardDetails>();

    public reportSummaryCards: Array<MReportSummaryCard> = [];

    public reportSummaryContent: MReportSummaryContent;
    public reportSummaryTitle: MReportSummaryTitle;
    public reportSummaryDescription: string;
    public notification = null;
    private reportSummaryUtils = new ReportSummaryUtils();

    constructor() {
        this.notification = this.reportSummaryUtils.notification;
    }

    public cardTypes: any = {
        SECURITY: 'security',
        INSIGHTS: 'insights',
        LICENSES: 'licenses',
        COMP_DETAILS: 'compDetails'
    };

    public titleAndDescription: any = {
        [this.cardTypes.SECURITY]: {
            title: 'Components with security issues in your stack',
            description: 'Description'
        },
        [this.cardTypes.INSIGHTS]: {
            title: 'Insights on alternate or additional components that can augment your stack',
            description: 'Description'
        },
        [this.cardTypes.LICENSES]: {
            title: 'License details of components in your stack',
            description: 'Description'
        },
        [this.cardTypes.COMP_DETAILS]: {
            title: 'Component details of your manifest file',
            description: 'Description'
        }
    };

    ngOnInit() {
        this.paintView();
    }

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['report'];
        if (summary) {
            this.report = <ResultInformationModel> summary.currentValue;
            this.repaintView();
        }
    }

    public handleSummaryClick(card: MReportSummaryCard): void {
        if (card) {
            let details: MCardDetails = new MCardDetails();
            let cardType: string = card.identifier || '';
            let { title, description } = this.getTitleAndDescription(cardType);

            details.reportInformations = this.getUIReportInformations(cardType);
            details.isMultiple = true;
            details.title = title;
            details.titleDescription = description;
            this.onCardClick.emit(details);
        }
    }

    private getUIReportInformations(cardType: string): Array<MReportInformation> {
        let reportInformations: Array<MReportInformation> = [];
        let componentDetails: Array<MComponentDetails> = [];
        let componentInformation: MComponentInformation = null;
        let recommendationInformation: MRecommendationInformation = null;
        let securityDetails: MSecurityDetails = null;
        let crowd: MCrowdSourcing = null;
        let github: MGithub = null;
        let osio: MOsio = null;
        let headers: Array<MComponentHeaderColumn> = this.fillColumnHeaders(cardType);
        let compInfoType: string = 'component';

        let components: Array<ComponentInformationModel> = null;
        if (this.report.user_stack_info
            && this.report.user_stack_info.analyzed_dependencies
            && this.report.user_stack_info.analyzed_dependencies.length > 0) {
           components = this.report.user_stack_info.analyzed_dependencies;
        }
        if (components) {
            components.forEach((component: ComponentInformationModel) => {
                componentInformation = this.getComponentInformation(component);
                componentDetails.push(new MComponentDetails(
                    componentInformation,
                    recommendationInformation
                ));
            });

            let genericReport: MReportInformation = new MReportInformation(
                null,
                'component',
                this.fillColumnHeaders(cardType, 1),
                componentDetails
            );

            switch (cardType) {
                case 'security':
                    genericReport.name = 'securityTab';
                    reportInformations.push(genericReport);
                    break;
                case 'insights':
                    genericReport.name = 'Usage Outlier Details';
                    reportInformations.push(genericReport);
                    reportInformations.push(new MReportInformation(
                        'Companion Component Details',
                        'recommendation',
                        this.fillColumnHeaders(cardType, 2),
                        componentDetails
                    ));
                    break;
                case 'licenses':
                    genericReport.name = 'Conflict License(s) details';
                    reportInformations.push(genericReport);
                    reportInformations.push(new MReportInformation(
                        'Unknown license(s) details',
                        'component',
                        this.fillColumnHeaders(cardType, 2),
                        componentDetails
                    ));
                    break;
                case 'compDetails':
                    genericReport.name = 'Analyzed component Details';
                    reportInformations.push(genericReport);
                    reportInformations.push(new MReportInformation(
                        'Unknown Component details',
                        'component',
                        this.fillColumnHeaders(cardType, 2),
                        componentDetails
                    ));
                    break;
                default:
                    break;
            }
            return reportInformations;
        }
        return null;
    }

    private getComponentInformation(component: ComponentInformationModel): MComponentInformation {
        if (component) {
            let currentVersion: string = component.version;
            let latestVersion: string = component.latest_version;
            let github: GithubModel = component.github;
            let hasLicenseIssue: boolean = component.license_analysis && component.license_analysis.conflict_licenses && component.license_analysis.conflict_licenses.length > 0;
            let isUsageOutlier: boolean = false;
            let securityDetails: MSecurityDetails = this.getComponentSecurity(component);
            let recommendation: RecommendationsModel = this.report.recommendation;
            let recommendationInformation: MRecommendationInformation = null;
            let usageOutliers: Array<OutlierInformationModel> = null;
            if (recommendation) {
                usageOutliers = recommendation.usage_outliers;
                if (usageOutliers) {
                    let outlierLen: number = usageOutliers.length;
                    for (let i = 0; i < outlierLen; ++ i) {
                        if (component.name === usageOutliers[i].package_name) {
                            isUsageOutlier = true;
                            break;
                        }
                    }
                }
                if (recommendation.alternate && recommendation.alternate.length > 0) {
                    let alternates: Array<ComponentInformationModel> = recommendation.alternate;
                    let alternatesLen: number = alternates.length;
                    for (let i = 0; i < alternatesLen; ++ i) {
                        if (alternates[i].replaces && alternates[i].replaces[0] && alternates[i].replaces[0].name) {
                            let alternate: ComponentInformationModel = alternates[i];
                            if (component.name === alternate.replaces[0].name) {
                                let alterSecurity: MSecurityDetails = this.getComponentSecurity(alternate);
                                recommendationInformation = new MRecommendationInformation(
                                    'alternate',
                                    alternate.reason,
                                    false,
                                    new MProgressMeter(
                                        '',
                                        alternate.confidence_reason,
                                        alternate.confidence_reason > 50 ? 'GREEN' : 'ORANGE',
                                        ''
                                    ),
                                    new MComponentInformation(
                                        alternate.name,
                                        alternate.version,
                                        alternate.latest_version,
                                        alterSecurity,
                                        alterSecurity !== null,
                                        false,
                                        false,
                                        alternate.licenses,
                                        new MCrowdSourcing(alternate.topic_list),
                                        new MGithub(
                                            alternate.github.contributors.toString(),
                                            alternate.github.forks_count.toString(),
                                            alternate.github.dependent_repos.toString(),
                                            alternate.github.stargazers_count.toString(),
                                            alternate.github.used_by.toString()
                                        ),
                                        new MOsio(alternate.osio_user_count.toString()),
                                        'Create work item',
                                        false,
                                        null
                                    )
                                );
                                break;
                            }
                        }
                    }
                }
            }
            return new MComponentInformation(
                component.name,
                currentVersion,
                latestVersion,
                securityDetails,
                securityDetails !== null,
                isUsageOutlier,
                hasLicenseIssue,
                component.licenses,
                new MCrowdSourcing(
                    component.topic_list
                ),
                new MGithub(
                    github.contributors.toString(),
                    github.forks_count.toString(),
                    github.dependent_repos.toString(),
                    github.stargazers_count.toString(),
                    github.used_by.toString()
                ),
                new MOsio(component.osio_user_count.toString()),
                null,
                true,
                recommendationInformation
            );
        }
        return null;
    }

    private getComponentSecurity(component: ComponentInformationModel): MSecurityDetails {
        return this.getComponentSecurityInformation(component);
    }

    private getTitleAndDescription(cardType: string): any {
        let { title, description } = this.titleAndDescription[cardType];
        return {
            title: title,
            description: description
        };
    }

    private fillColumnHeaders(cardType: string, tabNo: number = null): Array<MComponentHeaderColumn> {
        let headers: Array<MComponentHeaderColumn> = [];

        headers.push(new MComponentHeaderColumn(
            'serial',
            '#',
            'float-left extra-small'
        ));
        switch (cardType) {
            case 'security':
                headers.push(new MComponentHeaderColumn(
                    'component',
                    'Components',
                    'float-left medium'
                ));
                headers.push(new MComponentHeaderColumn(
                    'action',
                    'Action',
                    'float-left small'
                ));
                headers.push(new MComponentHeaderColumn(
                    'cveCount',
                    'No. of CVE(s)',
                    'float-left small'
                ));
                headers.push(new MComponentHeaderColumn(
                    'highestCVSS',
                    'Highest CVSS Score',
                    'float-left medium'
                ));
                headers.push(new MComponentHeaderColumn(
                    'cveIdOfH',
                    'CVE ID of highest CVSS score',
                    'float-left medium'
                ));
                break;
            case 'insights':
                headers.push(new MComponentHeaderColumn(
                    'component',
                    'Components',
                    'float-left medium'
                ));
                if (tabNo === 1) {
                    headers.push(new MComponentHeaderColumn(
                        'alternate',
                        'Alternate Components',
                        'float-left medium'
                    ));
                } else if (tabNo === 2) {

                }
                headers.push(new MComponentHeaderColumn(
                    'confidence',
                    'Confidence Score',
                    'float-left medium'
                ));
                headers.push(new MComponentHeaderColumn(
                    'feedback',
                    'Feedback',
                    'float-left small'
                ));
                headers.push(new MComponentHeaderColumn(
                    'action',
                    'Action',
                    'float-left small'
                ));
                break;
            case 'licenses':
                headers.push(new MComponentHeaderColumn(
                    'component',
                    'Components',
                    'float-left medium'
                ));
                if (tabNo === 1) {
                    headers.push(new MComponentHeaderColumn(
                        'licensesAffected',
                        'Licenses Affected',
                        'float-left medium'
                    ));

                } else if (tabNo === 2) {
                    headers.push(new MComponentHeaderColumn(
                        'unknownLicenses',
                        'Unknown License',
                        'float-left medium'
                    ));
                }
                headers.push(new MComponentHeaderColumn(
                    'alternate',
                    'Alternate Components',
                    'float-left medium'
                ));
                headers.push(new MComponentHeaderColumn(
                    'action',
                    'Action',
                    'float-left small'
                ));
                break;
            case 'compDetails':
                headers.push(new MComponentHeaderColumn(
                    'component',
                    'Components',
                    'float-left medium'
                ));
                if (tabNo === 1) {
                    headers.push(new MComponentHeaderColumn(
                        'componentCheck',
                        'Component Check',
                        'float-left medium'
                    ));
                    headers.push(new MComponentHeaderColumn(
                        'alternate',
                        'Alternate Components',
                        'float-left medium'
                    ));
                    headers.push(new MComponentHeaderColumn(
                        'action',
                        'Action',
                        'float-left small'
                    ));
                } else if (tabNo === 2) {
                    headers.push(new MComponentHeaderColumn(
                        'helpUsKnownMore',
                        'Help us Know more about this component',
                        'float-left large'
                    ));
                }
                break;
            default:
                break;
        }
        return headers;
    }

    private newCardInstance(): MReportSummaryCard {
        let newCard: MReportSummaryCard = new MReportSummaryCard();
        newCard.reportSummaryContent = new MReportSummaryContent();
        newCard.reportSummaryTitle = new MReportSummaryTitle();
        return newCard;
    }

    private getComponentSecurityInformation(component: ComponentInformationModel): MSecurityDetails {
        if (component) {
            let securityDetails: MSecurityDetails = new MSecurityDetails();
            let securityIssues: number = 0;
            let maxIssue: SecurityInformationModel = null,
            temp: SecurityInformationModel = null;
            if (component.security && component.security.length > 0) {
                let currSecurity: Array<SecurityInformationModel> = component.security;
                temp = currSecurity.reduce((a, b) => {
                    return parseFloat(a.CVSS) < parseFloat(b.CVSS) ? b : a;
                });
                if (temp) {
                    if (maxIssue === null || maxIssue.CVSS < temp.CVSS) {
                        maxIssue = temp;
                    }
                }
                securityIssues += currSecurity.length;
            }
            if (maxIssue) {
                securityDetails.highestIssue = new MSecurityIssue(
                    maxIssue.CVSS,
                    maxIssue.CVE
                );
                securityDetails.progressReport = new MProgressMeter(
                    '',
                    Number(maxIssue.CVSS),
                    Number(maxIssue.CVSS) >= 7 ? '#ff6162' : 'ORANGE',
                    ''
                );
            }
            securityDetails.totalIssues = securityIssues;
            return securityDetails;
        }
        return null;
    }

    private getSecurityReportCard(): MReportSummaryCard {
        return this.reportSummaryUtils.getSecurityReportCard(this.report.user_stack_info);
    }

    private getInsightsReportCard(): MReportSummaryCard {
        return this.reportSummaryUtils.getInsightsReportCard(this.report.recommendation);
    }

    private getLicensesReportCard(): MReportSummaryCard {
        return this.reportSummaryUtils.getLicensesReportCard(this.report.user_stack_info);
    }

    private getComponentDetailsReportCard(): MReportSummaryCard {
        let componentDetailsCard: MReportSummaryCard = this.reportSummaryUtils.newCardInstance();

        componentDetailsCard.identifier = this.cardTypes.COMP_DETAILS;
        componentDetailsCard.reportSummaryTitle.titleIcon = 'fa fa-cube';
        componentDetailsCard.reportSummaryTitle.titleText = 'Component Details';
        componentDetailsCard.reportSummaryDescription = 'This shows the Component Details Description and it can go to more than a line';
        componentDetailsCard.reportSummaryContent.infoEntries = [];

        if (this.report.user_stack_info
            && this.report.user_stack_info) {
            let userStackInfo: UserStackInfoModel = this.report.user_stack_info;

            let analyzedCount: number, totalCount: number, unknownCount: number;
            analyzedCount = userStackInfo.analyzed_dependencies ? userStackInfo.analyzed_dependencies.length : 0;
            totalCount = userStackInfo.dependencies ? userStackInfo.dependencies.length : 0;
            unknownCount = userStackInfo.unknown_dependencies ? userStackInfo.unknown_dependencies.length : totalCount - analyzedCount;

            let totalEntry: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            totalEntry.infoText = 'Total Components';
            totalEntry.infoValue = totalCount;

            let analyzedEntry: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            analyzedEntry.infoText = 'Analyzed Components';
            analyzedEntry.infoValue = analyzedCount;

            let unknownEntry: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            unknownEntry.infoText = 'Unknown Components';
            unknownEntry.infoValue = unknownCount;

            componentDetailsCard.reportSummaryContent.infoEntries.push(totalEntry);
            componentDetailsCard.reportSummaryContent.infoEntries.push(analyzedEntry);
            componentDetailsCard.reportSummaryContent.infoEntries.push(unknownEntry);
        } else {
            // Handle no user components scenario
        }

        return componentDetailsCard;
    }

    private updateCards(): void {
        let cards: Array<MReportSummaryCard> = [];
        if (this.report) {
            cards[0] = this.getSecurityReportCard();
            cards[1] = this.getInsightsReportCard();
            cards[2] = this.getLicensesReportCard();
            cards[3] = this.getComponentDetailsReportCard();
        }
        this.reportSummaryCards = cards;
    }

    private paintView(): void {
        this.updateCards();
    }

    private repaintView(): void {
        this.paintView();
    }
}
