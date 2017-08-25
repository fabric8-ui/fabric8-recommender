import {Component, Input, OnChanges} from '@angular/core';

import {ComponentInformationModel, RecommendationsModel, OutlierInformationModel} from '../models/stack-report.model';

@Component({
    selector: 'component-level-information',
    templateUrl: './component-level.component.html',
    styleUrls: ['component-level.component.scss']
})

export class ComponentLevelComponent implements OnChanges {

    @Input() component: any;
    @Input() isCompanion: boolean;
    @Input() filterBy: string;
    @Input() config: any;

    @Input() header: string;
    @Input() subHeader: string;

    @Input() data;

    public dependencies: Array<ComponentInformationModel> = [];
    public recommendations: RecommendationsModel;
    public messages: any;

    private dependenciesList: Array<any> = [];
    private headers: Array<any> = [];
    private keys: any = [];
    private alternate: Array<ComponentInformationModel> = [];
    private usageOutliers: Array<OutlierInformationModel> = [];

    private fieldName: string;
    private fieldValue: string;

    private filters: Array<any> = [];
    private currentFilter: string = '';

    private orderByName: string = '';
    private direction: string = '';
    private angleUp: string = 'fa-angle-up';
    private angleDown: string = 'fa-angle-down';

    public sortDirectionClass: string = this.angleDown;


    constructor() {
        this.keys = {
            name: 'name',
            currentVersion: 'curret_version',
            latestVersion: 'latest_version',
            cveid: 'cveid',
            cvss: 'cvss',
            license: 'license',
            linesOfCode: 'linesOfCode',
            avgCycloComplexity: 'avgCycloComplexity',
            noOfFiles: 'noOfFiles',
            dateAdded: 'dateAdded',
            publicPopularity: 'pubPopularity',
            enterpriseUsage: 'enterpriseUsage',
            teamUsage: 'teamUsage'
        };

        this.filters = [{
            name: 'All',
            identifier: 'reset'
        }, {
            name: 'Usage Outliers',
            identifier: 'isUsageOutlier',
            class: 'fa usage-outlier filter-icon'
        }, {
            name: 'Security Issues',
            identifier: 'has_issue',
            class: 'fa insecure fa-ban'
        }, {
            name: 'Alternate Components',
            identifier: 'isChild',
            class: 'fa fa-database child-icon alternate-component-icon'
        }];

        this.currentFilter = this.filters[0].name;
    }

    /**
     * handleKeyUpEvent - takes an event and returns nothing
     * 
     * Gets triggered everytime a value is typed in the filter box
     * Sets the received value to the fieldValue
     */
    public handleKeyUpEvent(event: Event): void {
        let target: any = event.target;
        this.fieldValue = target.value;
    }

    /**
     * Handles the click after changing the filters.
     */
    public handleDropDownClick(element: Element): void {
        if (element.classList.contains('open')) {
            element.classList.remove('open');
        } else {
            element.classList.add('open');
        }
    }

    public handleCollapseClick(event: Event): void {
        let target: any = event.target;
        if (target.classList.contains('parent-icon')) {
            let parent: HTMLElement = target.parentNode.parentNode;
            let id: string = parent.id;
            if (target.classList.contains('collapsed')) {
                target.classList.remove('collapsed');
                this.toggleEntries(id, true);
            } else {
                target.classList.add('collapsed');
                this.toggleEntries(id, false);
            }
        }
    }

    private toggleEntries(id: string, isCollapsed: boolean): void {
        let rows = document.getElementsByClassName(id);
        let len: number = rows.length;
        if (isCollapsed) {
            for (let i: number = 0; i < len; ++ i) {
                if (rows[i].classList.contains('collapse'))
                    rows[i].classList.remove('collapse');
            }
        } else {
            for (let i: number = 0; i < len; ++ i) {
                rows[i].classList.add('collapse');
            }
        }
    }

    public handleFilterFieldClick(element: Element, field: any, event: Event): void {
        event.stopPropagation();
        this.currentFilter = field.name;
        this.fieldName = field.identifier;
        if (element.classList.contains('open')) {
            element.classList.remove('open');
        } else {
            element.classList.add('open');
        }
        event.preventDefault();
    }

    /**
     * Handles the column header click.
     * This changes the tables entries either to ascending order or 
     * desending order in context to the field
     */
    public handleTableOrderClick(header: any): void {
        if (header.isSortable) {
            this.orderByName = header.identifier;
            if (!header.direction || header.direction.toLowerCase() === 'down') {
                header.direction = 'up';
                header.sortDirectionClass = this.angleUp;
            } else {
                header.direction = 'down';
                header.sortDirectionClass = this.angleDown;
            }
            this.direction = header.direction;
        }
    }

    ngOnChanges(): void {
        if (this.component) {
            console.log(this.component);
            if (this.isCompanion === undefined) {
                this.dependencies = this.component['dependencies'];
                this.recommendations = this.component['recommendations'];
                this.alternate = this.recommendations.alternate;
                this.usageOutliers = this.recommendations['usage_outliers'];
            } else {
                this.dependencies = this.component['dependencies'];
            }
            this.handleDependencies(this.dependencies);
        }
        if (this.filterBy) {
            this.fieldName = this.filterBy;
            this.currentFilter = this.filters.filter((f) => f.identifier === this.fieldName)[0].name;
        }
    }

    private handleDependencies(dependencies: Array<ComponentInformationModel>): void {
        if (dependencies) {
            let length: number = dependencies.length;
            let dependency: any, eachOne: ComponentInformationModel;
            this.headers = [
                {
                    name: 'Package name',
                    class: 'medium',
                    order: 1
                }, {
                    name: 'Current Version',
                    class: 'small',
                    order: 2
                }, {
                    name: 'Recommended Version',
                    class: 'small',
                    order: 3
                }, {
                    name: 'Latest Version',
                    class: 'small',
                    order: 4
                }, {
                    name: 'Security Issue',
                    class: 'small',
                    order: 5
                }, {
                    name: 'License',
                    class: 'medium',
                    order: 6
                }, {
                    name: 'OSIO Usage',
                    class: 'small',
                    order: 7
                }, {
                   name: 'Github Statistics',
                   class: 'small',
                   order: 8
                }, {
                    name: 'Github Dependants',
                    class: 'large',
                    order: 9
                }, {
                    name: 'Categories',
                    class: 'medium',
                    order: 10
                }
            ];

            if (this.isCompanion) {
                this.headers.splice(2, 1);
            }

            this.dependenciesList = [];
            let linesOfCode: any = '';
            let noOfFiles: any = '';
            let tempLen: number;
            for (let i: number = 0; i < length; ++i) {
                eachOne = dependencies[i];
                dependency = this.setParams(eachOne, this.isCompanion !== undefined);
                dependency['isUsageOutlier'] = this.isUsageOutlier(dependency['name']);
                dependency['compId'] = 'comp-' + i;
                this.dependenciesList.push(dependency);
                tempLen = this.dependenciesList.length;
                if (this.alternate) {
                    this.checkAlternate(eachOne['name'], eachOne['version'], this.dependenciesList, dependency['compId']);
                    if (tempLen !== this.dependenciesList.length) {
                        dependency['isParent'] = true;
                    }
                }
            }
        }
    }

    private setParams(input: any, canCreateWorkItem: boolean) {
        let output: any = {};
        let github: any = input['github'];
        output['name'] = input['name'];
        output['current_version'] = input['version'];
        if (canCreateWorkItem) {
            output['current_version'] = '';
            output['recommended_version'] = input['version'];
        } else {
            output['recommended_version'] = '';
        }
        output['recommended_version'] = this.putNA(output['recommended_version']);
        output['current_version'] = this.putNA(output['current_version']);
        output['latest_version'] = this.putNA(input['latest_version']);
        output['license'] = input['licenses'] && input['licenses'].join(', ') || '-';
        output['license_analysis'] = input['license_analysis'] && input['license_analysis'];
        output['sentiment_score'] = input['sentiment'] && input['sentiment']['overall_score'];
        output['github_user_count'] = input['github'] && input['github']['dependent_repos'];
        output['github_user_count'] = this.putNA(output['github_user_count']);
        output['osio_user_count'] = input['osio_user_count'];
        output['watchers'] = this.putNA(github['watchers']);
        output['stargazers_count'] = this.putNA(github['stargazers_count']);
        output['total_releases'] = this.putNA(github['total_releases']);
        output['forks_count'] = this.putNA(github['forks_count']);
        output['contributors'] = this.putNA(github['contributors']);
        output['git_stat'] = (output['github_user_count'] > -1 || output['watchers'] > -1 || output['stargazers_count'] > -1 || output['total_releases'] > -1 || output['forks_count'] > -1 || output['contributors'] > -1);
        output['has_issue'] = input['security'].length > 0;
        output['security_issue'] = output['has_issue'] ? Math.max.apply(Math, input['security'].map(d => d.CVSS)) : '';
        output['used_by'] = github['used_by'];
        output['categories'] = input['topic_list'];
        output['categories'] = (output['categories'] && output['categories'].length > 0 && output['categories'].join(', ')) || '';
        return output;
    }

    private putNA(count: any): any {
        return !count || count < 0 ? '-' : count;
    }

    private checkAlternate (name: string, version: string, list: Array<any>, parentId: string) {
        if (this.alternate && this.alternate.length > 0) {
            let recom: Array<ComponentInformationModel> = this.alternate.filter((a) => a.replaces[0].name === name && a.replaces[0].version === version);
            recom.forEach(r => {
                let obj: any = this.setParams(r, true);
                obj['isChild'] = true;
                obj['parent-reference'] = parentId;
                list.push(obj);
            });
        }
    }

    private isUsageOutlier(packageName: string): boolean {
        if (this.usageOutliers && this.usageOutliers.length > 0) {
            let result: Array<OutlierInformationModel> = this.usageOutliers.filter(u => u.package_name === packageName);
            return result && result.length > 0;
        }
    }

    /*
     *  handleCreateWorkItemAction - takes recommendation and returns nothing
     *  Creates work items in specified format to be consumed for POST request 
     */
    public handleCreateWIclick(recommender: any, event: Event): void {
        let workItems = [];
        let message: string = '';
        let codebaseobj: any = { codebase: {
              'repository': 'Test_Repo',
              'branch': 'task-1234',
              'filename': this.component["manifest_name"],
              'linenumber': 1
            }
        }
        //TODO form data to be shared with recommender object
        if(recommender && recommender.hasOwnProperty("isChild") && recommender["isChild"]){
            message = `Stack analytics has identified a potential missing library. It's  
            recommended that you change ${recommender.name} with version  ${recommender.recommended_version} 
            to your application as many other Vert.x OpenShift applications have it included`;
        } else {
            message = `Stack analytics has identified a potential missing library. It's  
            recommended that you add ${recommender.name} with version  ${recommender.recommended_version}
            to your application as many other Vert.x OpenShift applications have it included`;
        }
        let description: string = message;
                    let codebase: any = codebaseobj;
                    if (this.data && this.data.git) {
                        codebase['repository'] = this.data.git.uri || '';
                        codebase['branch'] = this.data.git.ref || 'master';
                    }
                    description += '<br />';
                    description += 'Repository: ' + codebase['repository'];
                    description += '<br /> Branch: ' + codebase['branch'];
                    description += '<br /> Filename: ' + codebase['filename'];
                    description += '<br /> Line Number: ' + codebase['linenumber'];
                    // let item: any = {
                    //     title: recommender['workItem']['action'],
                    //     description: description,
                    //     codebase: codebase,
                    //     key: recommender['key']
                    // };


    }

}
