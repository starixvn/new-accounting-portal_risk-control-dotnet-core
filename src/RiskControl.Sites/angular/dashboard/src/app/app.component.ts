import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NumberFormatHelper, NumberFormatType } from 'nap-components/number-format';
import { AppService } from './app.service';
import {
  TopMemberWinning,
  TopGameTypeWinning,
  ChartDataSet,
  ChartColor,
  WeeklyNetIncome,
  TotalPlayersByDevice
} from './app.model';
import { DATE_CONFIG } from './date.config';
import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    AppService
  ]
})

export class AppComponent implements OnInit {
  netIncomeDatasets: ChartDataSet[];
  netIncomeOptions: object;
  creditNetIncomeDatasets: ChartDataSet[];
  creditNetIncomeOptions: object;
  depositNetIncomeDatasets: ChartDataSet[];
  depositNetIncomeOptions: object;
  weekLabels: string[];
  weeklyNetIncome: WeeklyNetIncome[];
  totalPlayersByDeviceDatasets: ChartDataSet[];
  totalPlayersByDeviceOptions: object;
  weekLabelsOfPlayersDevice: string[];
  totalPlayersByDevice: TotalPlayersByDevice[];
  topCreditPlayer: TopMemberWinning[];
  topLicenseePlayer: TopMemberWinning[];
  topGameTypeWinning: TopGameTypeWinning[];
  currentMonth = moment.utc(DATE_CONFIG.reportDate.today).format('MM/YYYY');
  cachedDate: string;
  warehouseLastDate: string;

  title = 'dashboard';

  chartPlugins = [
    ChartDataLabels
  ]

  turnoverChartColors: Array<ChartColor> = [
    { // all colors in order
      backgroundColor: ['#6B96F8', '#6B96F8', '#6B96F8', '#6B96F8', '#6B96F8', '#6B96F8']
    }
  ];

  netIncomeChartColors: Array<ChartColor> = [
    { // all colors in order
      backgroundColor: ['#FA8334', '#FA8334', '#FA8334', '#FA8334', '#FA8334', '#FA8334']
    }
  ];

  creditNetIncomeChartColors: Array<ChartColor> = [
    { // all colors in order
      backgroundColor: ['#70ad47', '#70ad47', '#70ad47', '#70ad47', '#70ad47', '#70ad47']
    }
  ];

  depositNetIncomeChartColors: Array<ChartColor> = [
    { // all colors in order
      backgroundColor: ['#5b9bd5', '#5b9bd5', '#5b9bd5', '#5b9bd5', '#5b9bd5', '#5b9bd5']
    }
  ];

  totalPlayersByDeviceChartColors: Array<ChartColor> = [
    { 
      backgroundColor: ['#5b9bd5', '#5b9bd5', '#5b9bd5', '#5b9bd5', '#5b9bd5', '#5b9bd5']
    },
    { 
      backgroundColor: ['#FA8334', '#FA8334', '#FA8334', '#FA8334', '#FA8334', '#FA8334']
    },
  ];

  currencyChartColors: Array<ChartColor> = [
    { // all colors in order
      backgroundColor: ['#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826',
        '#35C826', '#35C826', '#35C826', '#35C826', '#35C826', '#35C826']
    }
  ];


  constructor(private readonly appService: AppService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.appService.queryWeeklyNetIncome().subscribe(data => {
      this.weeklyNetIncome = data;
      this.createWeeklyNetIncome();
    });

    this.appService.queryTotalPlayersByDevice().subscribe(data => {
      this.totalPlayersByDevice = data;
      this.createTotalPlayersByDevice();
    })

    this.appService.queryTopMemberWinning(false).subscribe(data => {
      this.topCreditPlayer = data;
    });

    this.appService.queryTopMemberWinning(true).subscribe(data => {
      this.topLicenseePlayer = data;
    });

    this.appService.queryTopGameTypeWinning().subscribe(data => {
      this.topGameTypeWinning = data;
    });
  }

  private createWeeklyNetIncome() {
    this.weekLabels = this.weeklyNetIncome.map(item => item.week);

    this.netIncomeDatasets = [{
      label: 'NetIncome',
      data: this.weeklyNetIncome.map(item => item.netIncome)
    }];

    this.netIncomeOptions = {
      title: {
        display: true,
        text: 'Weekly Net Income - Credit/Licensse (RM)',
        fontColor: '#595959',
        fontSize: '16'
      },
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label(tooltipItem) {
            return NumberFormatHelper.format(tooltipItem.yLabel, NumberFormatType.Integer);
          }
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            callback(value, index, values) {
              return callbackFn(value, index, values);
            }
          }
        }]
      }
    };

    this.creditNetIncomeDatasets = [{
      label: 'NetIncome - Credit',
      data: this.weeklyNetIncome.map(item => item.creditNetIncome)
    }];

    this.creditNetIncomeOptions = {
      title: {
        display: true,
        text: 'Weekly Net Income - Credit (RM)',
        fontColor: '#595959',
        fontSize: '16'
      },
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label(tooltipItem) {
            return NumberFormatHelper.format(tooltipItem.yLabel, NumberFormatType.Integer);
          }
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            callback(value, index, values) {
              return callbackFn(value, index, values);
            }
          }
        }]
      }
    };

    this.depositNetIncomeDatasets = [{
      label: 'NetIncome - Deposit',
      data: this.weeklyNetIncome.map(item => item.depositNetIncome)
    }];

    this.depositNetIncomeOptions = {
      title: {
        display: true,
        text: 'Weekly Net Income - Licensee (RM)',
        fontColor: '#595959',
        fontSize: '16'
      },
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label(tooltipItem) {
            return NumberFormatHelper.format(tooltipItem.yLabel, NumberFormatType.Integer);
          }
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            callback(value, index, values) {
              return callbackFn(value, index, values);
            }
          }
        }]
      }
    };
  }

  private createTotalPlayersByDevice() {
    this.weekLabelsOfPlayersDevice = this.totalPlayersByDevice.map(item => item.weekly);

    this.totalPlayersByDeviceDatasets = [
      {
        label: 'Mobile',
        data: this.totalPlayersByDevice.map(item => Math.round(item.mobilePlayers))
      },
      {
        label: 'Non-Mobile',
        data: this.totalPlayersByDevice.map(item => Math.round(item.nonMobilePlayers))
      }
    ];

    this.totalPlayersByDeviceOptions = {
      title: {
        display: true,
        text: 'Total Players by Device',
        fontColor: '#595959',
        fontSize: '16'
      },
      legend: {
        display: true
      },
      tooltips: {
        enabled: false,
        callbacks: {
          label(tooltipItem) {
            return NumberFormatHelper.format(tooltipItem.yLabel, NumberFormatType.Integer);
          }
        }
      },
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          display: false,
          stacked: true,
          ticks: {
            callback(value, index, values) {
              return callbackFn(value, index, values);
            }
          },
        }]
      },
      plugins: {
        datalabels: {
          color: '#ffffff',
          font : {
            weight: 'bold'
          },
        }
      }
    };
  }
}

function callbackFn (value, index, values) {
  const parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
