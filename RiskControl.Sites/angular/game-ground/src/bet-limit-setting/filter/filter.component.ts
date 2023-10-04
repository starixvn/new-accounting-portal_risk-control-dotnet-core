import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/forkJoin";
import * as _ from "lodash";
import { TreeviewConfig, TreeviewItem } from "ngx-treeview";
import { FilterService } from "../../common/filter";
import { FilterModel } from "./filter.model";
import {
  DefaultTreeviewConfig,
  ProductGameType
} from "../../common/filter/filter.model";

@Component({
  selector: "nap-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
  providers: [FilterService]
})
export class FilterComponent implements OnInit {
  @Output() valueChange = new EventEmitter<FilterModel>();
  products: TreeviewItem[] = [];
  selectedProducts: number[] = [];
  treeviewConfig: TreeviewConfig = DefaultTreeviewConfig;
  allProductGameTypes: ProductGameType[] = [];

  constructor(private readonly filterService: FilterService) {}

  ngOnInit() {
    this.filterService.queryProductGameTypes().subscribe(productGameTypes => {
      const products = _.uniqBy(productGameTypes, 'productId', 'productName');
      this.allProductGameTypes = productGameTypes;
      this.selectedProducts = _.map(products, product => product.productId);
      this.search();
    });
  }

  onProductChange(event: number[]) {
    this.selectedProducts = event;
  }

  search() {
    const filterModel: FilterModel = {
      productIds: this.selectedProducts.join(',')
    };
    this.valueChange.emit(filterModel);
  }
}
