import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import "rxjs/add/observable/forkJoin";
import * as _ from "lodash";
import { TreeviewConfig, TreeviewItem } from "ngx-treeview";
import { NapDate } from "nap-components/date";

import { GameType, FilterService } from "../../common/filter";

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
  gameTypes: GameType[] = [];
  selectedProducts: number[] = [];
  selectedGameTypes: number[] = [];
  fromDate: NapDate = NapDate.fromToday();
  toDate: NapDate = NapDate.fromToday();
  excludeTestData = true;
  today: NapDate = NapDate.fromToday();
  treeviewConfig: TreeviewConfig = DefaultTreeviewConfig;
  allProductGameTypes: ProductGameType[] = [];

  constructor(private readonly filterService: FilterService) {}

  ngOnInit() {
    this.filterService.queryProductGameTypes().subscribe(productGameTypes => {
      const products = _.uniqBy(productGameTypes, 'ProductId', 'ProductName');
      this.allProductGameTypes = productGameTypes;
      this.selectedGameTypes = _.map(productGameTypes, gameType => gameType.Bettype);
      this.selectedProducts = _.map(products, product => product.ProductId);
      this.search();
    });
  }

  onProductChange(event: number[]) {
    this.selectedProducts = event;
  }

  onGameTypeChange(event: number[]) {
    this.selectedGameTypes = event;
  }

  search() {
    const filterModel: FilterModel = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      productIds: this.selectedProducts.join(','),
      gameTypes: this.selectedGameTypes.join(','),
      excludeTestData: this.excludeTestData
    };
    this.valueChange.emit(filterModel);
  }
}
