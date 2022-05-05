import {
  Component,
  OnInit,
  Input,
  OnChanges,
  OnDestroy,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  ComponentFactoryResolver,
  SimpleChanges,
  ComponentFactory, Renderer2
} from '@angular/core';
import * as _ from 'lodash';
import { FilterModel, ReportType } from '../filter/filter.model';
import { Grid } from '../common/model';
import { GridService } from './grid.service';
import { CompanyComponent } from './company/company.component';
import { CurrencyComponent } from './currency/currency.component';
import { DailyComponent } from './daily/daily.component';
import { MonthlyComponent } from './monthly/monthly.component';
import { DeviceComponent } from './device/device.component';
import { ProductComponent } from './product/product.component';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  entryComponents: [
    DailyComponent,
    MonthlyComponent,
    CurrencyComponent,
    DeviceComponent,
    CompanyComponent,
    ProductComponent
  ]
})
export class GridComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterModel: FilterModel;
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  breadcrumbItems: string[];
  hasExcel: boolean;
  private components: ComponentRef<Grid>[] = [];
  private filterModelItems: FilterModel[] = [];


  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly renderer: Renderer2,
    private readonly service: GridService) { }

  ngOnInit() {
    this.service.generate = (filterModel: FilterModel) => this.generate(filterModel);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.filterModel) {
      return;
    }

    this.clear();
    this.filterModelItems.push(this.filterModel);
    this.service.filterModel = this.filterModel;
    this.createGrid(this.filterModel.reportType);
  }

  ngOnDestroy() {
    this.clear();
  }

  exportExcel() {
    if (this.components.length === 0) {
      return;
    }
    const component = this.components[this.components.length - 1];
    const grid = component.instance;
    const title = this.excelTitle;
    grid.exportExcel(title);
  }

  onBreadcrumbItemClick(index: number) {
    this.removeFilterModelItemFromIndex(index);
    this.setCurrentFilterModel();
    this.destroyComponentFromIndex(index);
    this.showBreadcrumbAndGrid();
  }

  private clear() {
    this.container.clear();
    this.components = [];
    this.filterModelItems = [];
  }

  private getComponentFactory(reportType: ReportType): ComponentFactory<Grid> {
    switch (reportType) {
      case ReportType.Daily:
        return this.componentFactoryResolver.resolveComponentFactory(DailyComponent);
      case ReportType.Monthly:
        return this.componentFactoryResolver.resolveComponentFactory(MonthlyComponent);
      case ReportType.Product:
        return this.componentFactoryResolver.resolveComponentFactory(ProductComponent);
      case ReportType.Currency:
        return this.componentFactoryResolver.resolveComponentFactory(CurrencyComponent);
      case ReportType.Company:
        return this.componentFactoryResolver.resolveComponentFactory(CompanyComponent);
      case ReportType.Device:
        return this.componentFactoryResolver.resolveComponentFactory(DeviceComponent);
      default:
        throw new Error('Not implemented yet');
    }
  }

  private generate(filterModel: FilterModel) {
    this.filterModelItems.push(filterModel);
    this.service.filterModel = this.filterModelItems[this.filterModelItems.length - 1];
    this.createGrid(filterModel.reportType);
  }

  private destroyComponentFromIndex(index: number) {
    while (this.components.length - 1 > index) {
      const component = this.components.pop();
      component.destroy();
    }
    this.showBreadcrumbAndGrid();
  }

  private createGrid(reportType: ReportType) {
    const factory = this.getComponentFactory(reportType);
    const component = this.container.createComponent(factory);
    this.components.push(component);
    const grid = component.instance;
    grid.query().subscribe({
      complete: () => {
        this.hasExcel = grid.hasExcel;
        this.showBreadcrumbAndGrid();
      }
    });
  }

  private showBreadcrumbAndGrid() {
    this.updateBreadcrumb();
    this.showOnlyLastGrid();
  }

  private updateBreadcrumb() {
    this.breadcrumbItems = [];
    const lastIndex = this.components.length - 1;
    this.components.forEach((component, index) => {
      let componentTitle = component.instance.title;
      if (index === lastIndex) {
        const fromDate = this.service.filterModel.fromDate;
        const toDate = this.service.filterModel.toDate;
        const currency = this.service.filterModel.currency.length > 1 ?
          'Original currency'
          : this.service.filterModel.selectedCollection.currencies.find(
            x => x.exchangeId === this.service.filterModel.currency[0]).currency;
        componentTitle += ` Void/Reject/Refund From ${fromDate} To ${toDate} (${currency})`;
      }

      this.breadcrumbItems.push(componentTitle);
    });
  }

  private showOnlyLastGrid() {
    const length = this.components.length;
    const currentComponent = this.components[length - 1];
    this.renderer.setProperty(currentComponent.location.nativeElement, 'hidden', '');
    if (length > 1) {
      const lastComponent = this.components[length - 2];
      this.renderer.setProperty(lastComponent.location.nativeElement, 'hidden', 'hidden');
    }
  }

  private removeFilterModelItemFromIndex(fromIndex: number) {
    let numberFilterModelItems = this.filterModelItems.length;
    while (numberFilterModelItems > fromIndex + 1) {
      _.pull(this.filterModelItems, this.filterModelItems[numberFilterModelItems - 1]);
      numberFilterModelItems--;
    }
  }

  private setCurrentFilterModel(): void {
    this.service.filterModel = this.filterModelItems[this.filterModelItems.length - 1];
  }

  private get excelTitle(): string {
    return this.breadcrumbItems.length > 1 ? this.breadcrumbItems.join(' > ') : this.breadcrumbItems[0];
  }
}
