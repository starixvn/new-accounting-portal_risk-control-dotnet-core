import { Component, ElementRef, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Helper } from 'nap-components/helper';
import { RoleId } from '../../common';
import { GridModalComponent } from 'components/grid-modal';
import { ModalService } from 'components/modal';
import { ModeController } from '../mode-controller';
import { ModeContext } from '../mode-context';
import { ModeGenerate } from '../mode.model';
import { ModelService } from '../common/model.service';
import { TitleService } from '../common/title.service';
import { GridService } from '../common/grid.service';
import { DailyGridModel } from '../daily/daily.model';
import { HourlyGridModel } from '../hourly/hourly.model';
import { UserNameService } from './user-name.service';
import {
  UserNameBaseQueryModel, UserNameGridModel
} from './user-name.model';
import { FilterConfig } from '../../filter/filter.config';
import { ReportType } from '../../filter/filter.model';

interface RowCustomAttribute {
  ReportBy: string;
  ReportById: number;
  SiteName: string;
  CurrencyId: number;
}

@Component({
  selector: 'nap-user-name',
  templateUrl: '../grid.html',
  providers: [
    UserNameService,
    TitleService,
    GridService,
    ModelService
  ]
})
export class UserNameComponent implements OnInit, ModeGenerate {
  gridOptions!: GridOptions;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly modalService: ModalService,
    private readonly modeContext: ModeContext,
    private readonly modeController: ModeController,
    private readonly userNameService: UserNameService,
    private readonly gridService: GridService,
    private readonly titleService: TitleService,
    private readonly modelService: ModelService,
  ) { }

  ngOnInit() {
    let gridOptions = this.modeContext.data as GridOptions;
    const queryModel = this.createQueryModel();
    if (_.isNil(gridOptions)) {
      this.userNameService.query(queryModel).subscribe(result => {
        gridOptions = result;
        this.updateGridOptions(gridOptions, queryModel, false);
      });
    } else {
      this.updateGridOptions(gridOptions, queryModel, true);
    }
  }

  onAfterGenerate(grid: ElementRef) {
    this.updateLinkAction(grid.nativeElement);
    this.modeController.compileBreadcrumb(grid.nativeElement);
  }

  generateTitle(isLast: boolean): string {
    return this.titleService.getBreadcrumbTitle(isLast);
  }

  private updateLinkAction(gridElement: HTMLElement) {
    $(gridElement).find('a[drill-down-user-name]').on('click', (event) => {
      const element = $(event.target);
      const userName = element.attr('user-name')??'';
      this.drillDownByUserName(userName);
    });

    $(gridElement).find('a[grand-total]').on('click', () => {
      this.showGrandTotal();
    });
  }

  private createQueryModel(): UserNameBaseQueryModel {
    const filterModel = this.modeContext.filterModel;
    const gridModel = this.modeContext.gridModel as UserNameGridModel;
    const queryModel = this.modelService.createQueryModel() as UserNameBaseQueryModel;
    queryModel.roleId = filterModel.roleId;
    queryModel.isDrillDown = gridModel.isDrillDownFromUserName;
    return queryModel;
  }

  private showGrandTotal() {
    const gridModel = this.modeContext.gridModel as UserNameGridModel;
    const queryModel = this.createQueryModel();
    this.modelService.updateModelToQueryGrandTotal(queryModel);

    queryModel.isDrillDown = gridModel.isDrillDownFromUserName ?
      gridModel.isDrillDownFromUserName :
      gridModel.isDrillDownCurrency;

    this.userNameService.queryGrandTotal(queryModel).subscribe(gridOptions => {
      gridOptions.fullHeight = false;
      gridOptions.gridHeight = 500;
      gridOptions.titleInfo = {
        text: gridOptions.titleInfoText,
        showExcelButton: true,
        exportExcelFunction: () => this.excelGrandTotal(queryModel)
      };
      this.modalService.open(GridModalComponent, { size: { width: 1200 } }, gridOptions);
    });
  }

  private drillDownUserName(userName: string, roleId: RoleId) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.roleId = roleId;
    filterModel.userName = userName;
    const modeContext = ModeContext.create(userName, filterModel, new UserNameGridModel(false, true));
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownDaily(userName: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);

    filterModel.reportType = ReportType.Daily;

    filterModel.userName = userName;
    const gridModel = new DailyGridModel(false, true);
    const modeContext = ModeContext.create(userName, filterModel, gridModel);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownHourly(userName: string) {
    const filterModel = _.cloneDeep(this.modeContext.filterModel);
    filterModel.reportType = ReportType.Hourly;
    filterModel.userName = userName;
    const gridModel = new HourlyGridModel(false, true);
    const modeContext = ModeContext.create(userName, filterModel, gridModel);
    this.modeController.forward(this.gridOptions, modeContext);
  }

  private drillDownByUserName(userName: string) {
    const filterModel = this.modeContext.filterModel;
    const gridModel = this.modeContext.gridModel as UserNameGridModel;
    switch (filterModel.roleId) {
      case RoleId.Super:
        if (gridModel.isDrillDownFromUserName) {
          this.drillDownUserName(userName, RoleId.Master);
        } else {
          this.drillDownUserName(userName, RoleId.Super);
        }
        break;
      case RoleId.Master:
        if (gridModel.isDrillDownFromUserName) {
          this.drillDownUserName(userName, RoleId.Agent);
        } else {
          this.drillDownUserName(userName, RoleId.Master);
        }
        break;
      case RoleId.Agent:
        if (gridModel.isDrillDownFromUserName) {
          this.drillDownByMember(userName);
        } else {
          this.drillDownUserName(userName, RoleId.Agent);
        }
        break;
      case RoleId.Member:
        this.drillDownByMember(userName);
        break;
    }
  }

  private drillDownByMember(userName: string) {
    this.drillDownDaily(userName);
  }

  private updateGridOptions(gridOptions: GridOptions, queryModel: UserNameBaseQueryModel, isBack: boolean) {
    if (!isBack && gridOptions.bodyRows.length > 0 && !this.gridService.isDrilldown()) {
      if (this.hasDrillDownOnUserName()) {
        this.updateUserNameColumn(gridOptions);
      }

      this.updateGrandTotalCell(gridOptions);
    }

    gridOptions.showPager = true;
    if (_.isNil(gridOptions.pagerOption)) {
      gridOptions.pagerOption = {
        itemsPerPage: 100,
        currentPage: 0,
        itemsPerPageArray: [100, 200, 500],
        showDetail: true,
        afterPagedFunction: (pagerOption) => this.afterPaged()
      };
    } else {
      gridOptions.pagerOption.afterPagedFunction = () => this.afterPaged();
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

  private hasDrillDownOnUserName(): boolean {
    const filterModel = this.modeContext.filterModel;
    const gridModel = this.modeContext.gridModel as UserNameGridModel;
    const isViewMember = filterModel.roleId === RoleId.Member
      || (filterModel.roleId === RoleId.Agent && gridModel.isDrillDownFromUserName);
    if (isViewMember) {
      return this.gridService.hasDrillDownHourly();
    }

    return true;
  }

  private afterPaged() {
    this.updateLinkAction(this.elementRef.nativeElement);
  }

  private updateUserNameColumn(gridOptions: GridOptions) {
    const reportByColumn = FilterConfig.gridColumns.reportBy;
    gridOptions.bodyRows.forEach(row => {
      for (const column of row.columns) {
        if (column.name === reportByColumn.value) {
          const customAttribute = JSON.parse(row.customAttr) as RowCustomAttribute;
          const userName = customAttribute.ReportBy;
          column.value = `<a href="javascript:;" drill-down-user-name user-name='${userName}'>${userName}</a>`;
        }
      }
    });
  }

  private updateGrandTotalCell(gridOptions: GridOptions) {
    const row = gridOptions.footerRows[0];
    const column = row.columns[0];
    const value = column.value;
    column.value = `<a href="javascript:;" grand-total>${value}</a>`;
  }

  private excel(queryModel: UserNameBaseQueryModel) {
    const extensionFileName = 'xlsx';

    this.userNameService.excel(queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelFileName(extensionFileName);
        Helper.downloadFile(response, fileName);
      });
  }

  private excelGrandTotal(queryModel: UserNameBaseQueryModel) {
    this.userNameService.excelGrandTotal(queryModel)
      .subscribe(response => {
        const fileName = this.titleService.getExcelGrandTotalFileName();
        Helper.downloadFile(response, fileName);
      });
  }

  private sort(queryModel: UserNameBaseQueryModel, sortColumnName: string, sortDirection: string) {
    queryModel.sortColumnName = sortColumnName;
    queryModel.sortDirection = sortDirection;
    this.userNameService.query(queryModel).subscribe(gridOptions => {
      this.updateGridOptions(gridOptions, queryModel, false);
    });
  }
}
