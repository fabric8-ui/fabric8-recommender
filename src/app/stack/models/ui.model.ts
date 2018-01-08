export class MReportSummaryTitle {
    titleIcon: string;
    titleText: string;
    notificationIcon?: string;
    notificationIconBgColor?: string;

    // constructor(titleIcon: string, title: string, notificationIcon: string = null) {
    //     this.titleIcon = titleIcon;
    //     this.title = title;
    //     this.notificationIcon = notificationIcon;
    // }
}

export class MReportSummaryInfoEntry {
    infoText: string;
    infoValue: any;
    infoType: string = 'text'; // Defaults to text, can also have chart
    config?: any; // Can be made as a class later. It can have chart type, values and other related configurations
}

export class MReportSummaryContent {
    infoEntries: Array<MReportSummaryInfoEntry>;
}

export class MReportSummaryCard {
    reportSummaryTitle: MReportSummaryTitle;
    reportSummaryDescription: string;
    reportSummaryContent: MReportSummaryContent;
    hasWarning?: boolean;
}

export class MProgressMeter {
    headerText: string;
    value: number;
    bgColor: string;
    footerText: string;
}

/** Bottom Section */
export class MGithub {
    contributors?: string = 'NA';
    forks?: string = 'NA';
    depRepos?: string = 'NA';
    stars?: string = 'NA';
    usage?: string = 'NA';
}

export class MOsio {
    usage?: string = 'NA';
}

export class MCrowdSourcing {
    tags: Array<string>;
    canSuggestTags?: boolean = true;
}

export class MSecurityIssue {
    cvss: string;
    cve: string;
}

export class MSecurityDetails {
    issues?: Array<MSecurityIssue> = null;
    highestIssue?: MSecurityIssue = null;
    progressReport?: MProgressMeter = null;
}

export class MComponentInformation {
    name: string;
    currentVersion?: string = 'NA';
    latestVersion?: string = 'NA';
    securityDetails?: MSecurityDetails = null;
    hasSecurityIssue?: boolean;
    isUsageOutlier?: boolean;
    hasLicenseIssue?: boolean;
    licenses: Array<string>;
    crowdSourcing: MCrowdSourcing;
    github: MGithub;
    osio: MOsio;
    action?: string = null;
    needsExpansion?: boolean = true;
    recommendation?: MRecommendationInformation = null;
}

export class MRecommendationInformation extends MComponentInformation {
    type: string; // Alternate or companion
    reason?: string = null;
    feedback?: boolean;
    confidenceScore: MProgressMeter;
}

export class MComponentDetails {
    type: string;
    componentInformation?: MComponentInformation = null;
    recommendationInformation?: MRecommendationInformation = null;
}

export class MComponentHeaderColumn {
    identifier: string;
    text: string;
    className: string;
    isSortable?: boolean = false;
    isDragable?: boolean = false;
}

export class MReportInformation {
    name: string;
    headers: Array<MComponentHeaderColumn>;
    componentDetails: Array<MComponentDetails>;
}

export class MCardDetails {
    title: string;
    titleDescription: string;
    isMultiple?: boolean = true; // This is for tabs, in case it is false, report won't be rendered inside tabs
    reportInformations: Array<MReportInformation>;
}
/** Bottom Section */
