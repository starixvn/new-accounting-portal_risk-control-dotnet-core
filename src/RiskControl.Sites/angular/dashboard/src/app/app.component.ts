import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NumberFormatHelper, NumberFormatType } from 'nap-components/number-format';
import { AppService } from './app.service';
import {
  CurrencyNetIncome,
  MonthlyTurnoverAndNetIncome,
  ProductTurnover,
  TopMemberWinning,
  TopGameTypeWinning,
  WinLossLimit,
  ChartDataSet,
  ChartColor
} from './app.model';
import { DATE_CONFIG } from './date.config';

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
  turnoverOptions: object;
  turnoverDatasets: ChartDataSet[];
  monthLabels: string[];
  currencyLabels: string[];
  currencyDatasets: ChartDataSet[];
  currencyOptions: object;
  productLabels: string[];
  productDatasets: ChartDataSet[];
  productOptions: object;
  currencyNetIncome: CurrencyNetIncome[];
  monthlyTurnoverAndNetIncome: MonthlyTurnoverAndNetIncome[];
  productTurnover: ProductTurnover[];
  topMemberWinning: TopMemberWinning[];
  topGameTypeWinning: TopGameTypeWinning[];
  winlossLimit: WinLossLimit[];
  currentMonth = moment.utc(DATE_CONFIG.reportDate.today).format('MM/YYYY');
  cachedDate: string;
  warehouseLastDate: string;
  xxx: string;

  title = 'dashboard';

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
    this.appService.queryCurrencyNetIncome().subscribe(data => {
      this.currencyNetIncome = data;
      this.createCurrencyNetIncome();
    });

    this.appService.queryMonthlyTurnoverAndNetIncome().subscribe(data => {
      this.monthlyTurnoverAndNetIncome = data;
      this.createMonthlyTurnoverAndNetIncome();
    });

    this.appService.queryProductTurnover().subscribe(data => {
      this.productTurnover = data;
      this.createProductTurnover();
    });

    this.appService.queryTopMemberWinning().subscribe(data => {
      this.topMemberWinning = data;
    });

    this.appService.queryTopGameTypeWinning().subscribe(data => {
      this.topGameTypeWinning = data;
    });

    this.appService.queryWinLossLimit().subscribe(data => {
      this.winlossLimit = data;
    });
  }

  private createMonthlyTurnoverAndNetIncome() {
    this.monthLabels = this.monthlyTurnoverAndNetIncome.map(item => item.month);

    this.netIncomeDatasets = [{
      label: 'NetIncome',
      data: this.monthlyTurnoverAndNetIncome.map(item => item.netIncome)
    }];

    this.netIncomeOptions = {
      title: {
        display: true,
        text: 'Net Income - Last 6 Months (BaseRM)',
        fontColor: '#63B6FE',
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

    this.turnoverDatasets = [{
      label: 'Turnover',
      data: this.monthlyTurnoverAndNetIncome.map(item => item.turnover)
    }];

    this.turnoverOptions = {
      title: {
        display: true,
        text: '3rd Products Turnover - Last 6 Months (BaseRM)',
        fontColor: '#63B6FE',
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

  private createCurrencyNetIncome() {
    this.currencyLabels = this.currencyNetIncome.map(item => item.currency);

    this.currencyDatasets = [{
      label: 'Net Income By Currency',
      data: this.currencyNetIncome.map(item => item.netIncome)
    }];

    this.currencyOptions = {
      title: {
        display: true,
        text: `Net Income by Currency - ${this.currentMonth} (Base RM)`,
        fontColor: '#63B6FE',
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

  private createProductTurnover() {
    this.productLabels = this.productTurnover.map(item => item.product);

    this.productDatasets = [{
      label: '',
      data: this.productTurnover.map(item => item.turnover)
    }];

    this.productOptions = {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Turnover By Product - ${this.currentMonth} (Base RM)`,
        fontColor: '#63B6FE',
        fontSize: '16'
      },
      tooltips: {
        callbacks: {
          label(tooltipItem, data) {
            const label = data.labels[tooltipItem.index];
            const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return `${label} : ${NumberFormatHelper.format(value, NumberFormatType.Integer)}`;
          }
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
