import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'overview-stack',
    templateUrl: './overview.html',
    styleUrls: ['./overview.scss']
})
export class OverviewComponent implements OnInit {
    @Input() stackOverviewData;

    private dependenciesChart: any;
    private compUsageChart: any;
    private cveDataList: any;
    private chartConfigs: any;
    private chartOptions: any;

    constructor() { }

    ngOnInit() {
        if (this.stackOverviewData) {
            this.chartOptions = {
                    donut: {
                        width: 50,
                        title: ''
                    },
                    color: {
                        pattern: ['#696969', '#A9A9A9']
                    }
                };
            this.chartConfigs = {
                    legend: {
                        position: 'right'
                    }
                };

            this.dependenciesChart = {
                data: {
                    columns: [],
                    type: 'donut'
                },
                chartOptions: {},
                configs: {}
            };

            this.compUsageChart = {
                data: {
                    columns: [],
                    type: 'donut'
                },
                chartOptions: {},
                configs: {}
            };

            this.dependenciesChart.chartOptions = this.chartOptions;
            this.dependenciesChart.configs = this.chartConfigs;
            this.dependenciesChart.data.columns = this.stackOverviewData.dependencyChart;
            this.dependenciesChart.chartOptions.donut.title = '32 Dependencies';

            this.compUsageChart.chartOptions = this.chartOptions;
            this.compUsageChart.configs = this.chartConfigs;
            this.compUsageChart.data.columns = this.stackOverviewData.compUsageChart;
            this.compUsageChart.chartOptions.donut.title = 'Component usage';

            this.cveDataList = this.stackOverviewData.CVEdata;
        }
    }
}
