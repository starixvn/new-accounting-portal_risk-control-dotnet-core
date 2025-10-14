import { Component, ElementRef, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Helper } from 'nap-components/helper';
import { ToastService } from 'nap-components/toast';
import { ModalService } from 'components/modal';
import { RoleId } from '../../common/model';
import { ModelService } from '../common/model.service';
import { TitleService } from '../common/title.service';
import { GridService } from '../common/grid.service';
import { RowAttribute, ModeGenerate } from '../mode.model';
import { ModeController } from '../mode-controller';
import { ModeContext } from '../mode-context';
import { UserNameBaseQueryModel, UserNameGridModel } from '../user-name/user-name.model';
import { UserNameService } from '../user-name/user-name.service';
import { DailyGridModel } from '../daily/daily.model';
import { HourlyGridModel } from '../hourly/hourly.model';
import { Top20Service } from './top20.service';
import { Top20BaseQueryModel, TopType, Top20GridModel } from './top20.model';
import { ReportType } from '../../filter/filter.model';
import { FilterConfig } from '../../filter/filter.config';
import { FilterHelper } from '../../filter/filter-helper';

interface SubRowCustomAttribute {
  groupName: string;
}

@Component({
  selector: 'nap-top20',
  templateUrl: '../grid.html',
  providers: [
    Top20Service,
    UserNameService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class Top20Component implements OnInit, ModeGenerate {
  gridOptions!: GridOptions;

  constructor(
    private readonly modalService: ModalService,
    private readonly modeContext: ModeContext,
    private readonly modeController: ModeController,
    private readonly top20Service: Top20Service,
    private readonly userNameService: UserNameService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit() {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.createQueryModel();
    if (_.isNil(gridOptions)) {
      this.top20Service.query(queryModel).subscribe(result => {
        gridOptions = result;
        this.updateGridOptions(gridOptions, queryModel, false);
      });
    } else {
      this.updateGridOptions(gridOptions, queryModel, true);
    }
  }

  onAfterGenerate(grid: ElementRef) {
    $(grid.nativeElement).find('a[drill-down-user-name]').on('click', (event) => {
      const element = $(event.target);
      const userName = element.attr('user-name') ?? '';
      this.drillDownByUserName(userName);
    });

    $(grid.nativeElement).find('a[drill-down-currency]').on('click', (event) => {
      const element = $(event.target);
      const currencyName = element.text();
      const currency = element.attr('currency') ?? '';
      const topType = parseInt(element.attr('top-type') ?? '', 10);
      this.drillDownCurrency(currencyName, currency, topType);
    });

    this.modeController.compileBreadcrumb(grid.nativeElement);
  }

  generateTitle(isLast: boolean): string {
    return this.titleService.getBreadcrumbTitle(isLast);
  }

  private drillDownByUserName(userName: string) {
    const filterModel = this.modeContext.filterModel;
    switch (filterModel.roleId) {
      case RoleId.Super:
        this.drillDownUserName(userName, RoleId.Super);
        break;
      case RoleId.Master:
        this.drillDownUserName(userName, RoleId.Master);
        break;
      case RoleId.Agent:
        this.drillDownUserName(userName, RoleId.Agent);
        break;
      case RoleId.Member:
        this.drillDownDaily(userName);
        break;
    }
  }

  private createQueryModel(): Top20BaseQueryModel {
    const filterModel = this.modeContext.filterModel;
    const queryModel = this.modelService.createQueryModel() as Top20BaseQueryModel;
    queryModel.sortColumnName = 'GameIncome';
    const gridModel = this.modeContext.gridModel;
    let topType = TopType.All;
    if (gridModel instanceof Top20GridModel) {
      topType = gridModel.topType;
    }

    queryModel.roleId = filterModel.roleId;
    queryModel.topType = topType;
    return queryModel;
  }

  private drillDownUserName(userName: string, roleId: RoleId) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.reportType = ReportType.UserName;
    filterModel.roleId = roleId;
    filterModel.userName = userName;
    filterModel.isDrillDown = true;
    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    const label = `Top 20 ${FilterHelper.getRoleName(filterModel.roleId)}`;
    const modeContext = ModeContext.create(label, filterModel, new Top20GridModel(false, true));
    modeContext.extraLabel = userName;
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownDaily(userName: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.reportType = ReportType.Daily;
    filterModel.userName = userName;
    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    const gridModel = new DailyGridModel(false, true);
    const label = `Top 20 ${FilterHelper.getRoleName(filterModel.roleId)}`;
    const modeContext = ModeContext.create(label, filterModel, gridModel);
    modeContext.extraLabel = userName;
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownCurrency(title: string, currency: string, topType: TopType) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.currency = currency;
    filterModel.sortColumnName = '';
    filterModel.sortDirection = '';
    const label = `Top 20 ${FilterHelper.getRoleName(filterModel.roleId)}`;
    const modeContext = ModeContext.create(label, filterModel, new Top20GridModel(true, false, topType));
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: Top20BaseQueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0 && !this.gridService.isDrilldown()) {
      this.updateUserNameColumn(gridOptions);
      if (this.gridService.hasCurrencyColumn()) {
        this.updateCurrencyColumn(gridOptions);
      }
    }

    gridOptions.titleInfo = {
      text: this.modeController.generateBreadcrumb(true),
      showExcelButton: true,
      exportExcelFunction: () => this.excel(queryModel)
    };
    gridOptions.sortOption = {
      serverSortFunction:
        (sortColumnName: string, sortDirection: string) => this.sort(queryModel, sortColumnName, sortDirection)
    };
    this.gridOptions = gridOptions;
  }

  private updateUserNameColumn(gridOptions: GridOptions) {
    const reportByColumn = FilterConfig.gridColumns.reportBy;
    gridOptions.bodyRows.forEach(row => {
      row.subRows.forEach(subRow => {
        for (const column of subRow.columns) {
          if (column.name === reportByColumn.value) {
            const rowAttribute = JSON.parse(subRow.customAttr) as SubRowCustomAttribute;
            const userName = rowAttribute.groupName;
            column.value = `<a href="javascript:;" drill-down-user-name user-name="${userName}">${userName}</a>`;
            break;
          }
        }
      });
    });
  }

  private updateCurrencyColumn(gridOptions: GridOptions) {
    const currencyColumn = FilterConfig.gridColumns.currency;
    gridOptions.bodyRows.forEach(row => {
      const rowAttribute = JSON.parse(row.customAttr) as RowAttribute;
      const topType = rowAttribute.groupName;
      for (const column of row.columns) {
        if (column.name === currencyColumn.value) {
          const currency = column.customAttr;
          // tslint:disable-next-line:max-line-length
          column.value = `<a href="javascript:;" drill-down-currency currency="${currency}" top-type="${topType}">${column.value}</a>`;
          break;
        }
      }
    });
  }

  private excel(queryModel: Top20BaseQueryModel) {
    const filterModel = this.modeContext.filterModel;
    const maxDate = moment.utc(filterModel.fromDate).add(1, 'month');
    if (filterModel.roleId === RoleId.Member && !filterModel.toDate.isBefore(maxDate)) {
      this.toastService.activate(`Date range should not exceed 1 month to export excel!`);
      return;
    }

    if (queryModel.topType === TopType.All) {
      const userNameQueryModel: UserNameBaseQueryModel = _.cloneDeep(queryModel);
      userNameQueryModel.reportBy = ReportType[ReportType.UserName];
      this.userNameService.excel(userNameQueryModel)
        .subscribe(response => {
          const fileName = this.titleService.getExcelFileName('xlsx');
          Helper.downloadFile(response, fileName);
        });
    } else {
      this.top20Service.excel(queryModel)
        .subscribe(response => {
          const fileName = this.titleService.getExcelFileName();
          Helper.downloadFile(response, fileName);
        });
    }
  }

  private sort(queryModel: Top20BaseQueryModel, sortColumnName: string, sortDirection: string) {
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    this.top20Service.query(queryModel).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }
}
