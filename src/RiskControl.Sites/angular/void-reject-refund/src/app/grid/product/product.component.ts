import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ProductService } from './product.service';
import { Grid } from 'src/app/common/model';
import { ProductModel } from './product.model';
import { GridService } from '../grid.service';
import { FilterModel } from 'src/app/filter/filter.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements Grid {

  reportData: ProductModel;
  sortColumnName = '';
  sortDirection = '';
  collapseAll = false;

  constructor(private readonly gridService: GridService, private readonly productService: ProductService) {
    this.sortColumnName = this.gridService.filterModel.sortColumnName;
    this.sortDirection = this.gridService.filterModel.sortDirection;
    this.collapseAll = true;
  }

  query(): Observable<ProductModel> {
    return Observable.create(observer => {
      const filterModel = this.gridService.filterModel;
      this.productService.query(filterModel).subscribe(data => {
        this.reportData = data;
        observer.complete();
      });
    });
  }

  exportExcel(title: string) {
    const filterModel: FilterModel = _.cloneDeep(this.gridService.filterModel);
    filterModel.sortColumnName = this.sortColumnName;
    filterModel.sortDirection = this.sortDirection;
    this.productService.exportExcel(title, filterModel);
  }

  get title(): string {
    return 'Product';
  }

  get hasExcel() {
    return this.hasData;
  }

  get hasData(): boolean {
    return this.reportData.ProductStatistics.length > 0;
  }

  sort(sortColumnName: string) {
    if (this.sortColumnName !== sortColumnName) {
      this.sortDirection = '';
    }

    this.sortColumnName = sortColumnName;
    this.sortDirection = this.sortDirection !== 'asc' ? 'asc' : 'desc';

    const filterModel: FilterModel = _.cloneDeep(this.gridService.filterModel);
    filterModel.sortColumnName = this.sortColumnName;
    filterModel.sortDirection = this.sortDirection;
    this.productService.query(filterModel).subscribe(data => {
      this.reportData = data;
    });
  }

  toggleReport() {
    this.collapseAll = !this.collapseAll;
    this.reportData.ProductStatistics.forEach(item => {
      item.isCollapse = this.collapseAll;
      return item;
    });
  }
}
