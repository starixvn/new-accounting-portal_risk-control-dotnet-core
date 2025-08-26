import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ManageProductStatusCriteria, Product } from './filter.model';
import { TreeviewConfig } from 'ngx-treeview';
import { FilterService } from './filter.service';
import { ToastService } from 'nap-components/toast';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() valueChange = new EventEmitter<ManageProductStatusCriteria>();
  productItems: Product[] = [];
  selectedProducts: number[] = [];

  public itemConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500
  });

  constructor(private readonly filterService: FilterService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.filterService.getProducts().subscribe(products => this.productItems = products);
  }

  search(): void {
      if (this.isValid()) {
        const criteria: ManageProductStatusCriteria = {
          productIds: this.selectedProducts.join(',')
        };
        this.valueChange.emit(criteria);
      }
  }

  private isValid(): boolean {
    if (this.selectedProducts.length <= 0) {
      this.toastService.activate('Please select at least one Product!');
      return false;
    }

    return true;
  }

}
