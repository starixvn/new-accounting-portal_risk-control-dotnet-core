import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { TreeviewConfig, TreeviewItem } from "ngx-treeview";
import { TypeaheadQuery } from "nap-components/dropdown-typeahead";
import { FilterModel } from "./filter.model";
import {
  Product,
  Currency,
  Site,
  QueryCurrencyModel,
  FilterService,
  FilterHelper,
  SiteType,
  SiteGroup,
} from "../../common/filter";
import { ToastService } from "nap-components/toast";

@Component({
  selector: "nap-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
  providers: [FilterService],
})
export class FilterComponent implements OnInit {
  @Output() generate = new EventEmitter<FilterModel>();
  userName: string;
  userNameTypeaheadQuery: TypeaheadQuery;
  products: Product[];
  selectedProduct: Product = null;
  productConfig = {
    displayKey: "name",
    search: true,
    limitTo: 0,
    height: "450px",
    with: "135px",
    enableSelectAll: true,
    placeholder: "",
  };
  productId: number = 0;
  siteGroups: SiteGroup[] = [];
  siteTreeviewConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500,
  });
  selectedSites: number[] = [];
  sitesLength: number = 0;
  currencies: Currency[];
  currencyId: number;

  constructor(
    private toastService: ToastService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.userNameTypeaheadQuery =
      this.filterService.createUserNameTypeaheadQuery();
    this.filterService.queryProducts().subscribe((products) => {
      this.products = FilterHelper.insertProductAll(products);
      this.productId = this.products[0].id;
      this.selectedProduct = this.products[0];
    });
    this.querySite(0);
  }

  onProductChange() {
    console.log("onProductChange", this.selectedProduct);
    this.productId = this.selectedProduct == null ? 0 : this.selectedProduct.id;
    this.currencyId = 0;
    this.querySite(this.productId);
  }

  onSiteSelectedChange(siteIds: number[]) {
    if (siteIds.length > 0) {
      this.selectedSites = siteIds;
      const currencyQueryModel: QueryCurrencyModel = {
        isCreditSite: FilterHelper.getSiteType(
          this.siteGroups,
          this.selectedSites
        ),
        multiSite:
          siteIds.length === this.sitesLength ? "0" : siteIds.join(","),
      };
      this.queryCurrencies(currencyQueryModel);
    } else {
      this.selectedSites = [];
      this.initCurrencies([]);
    }
  }

  search() {
    if (this.selectedSites.length === 0) {
      this.toastService.activate("Please select a Site / Licensee");
      return;
    }
    const filterModel: FilterModel = {
      userName: this.userName,
      productId: this.productId,
      multiSite:
        this.selectedSites.length === this.sitesLength
          ? "0"
          : this.selectedSites.join(","),
      currencyId: this.currencyId,
    };
    this.generate.emit(filterModel);
  }

  private querySite(productId: number) {
    this.filterService.querySites(productId).subscribe((siteGroups) => {
      this.siteGroups = siteGroups;
      this.sitesLength = FilterHelper.countAllSiteItems(this.siteGroups);
    });
  }

  private queryCurrencies(currencyQueryModel: QueryCurrencyModel) {
    this.filterService
      .queryCurrencies(currencyQueryModel)
      .subscribe((currencies) => {
        this.initCurrencies(currencies);
      });
  }

  private initCurrencies(currencies: Currency[]): void {
    this.currencies = FilterHelper.insertCurrencyAll(currencies);
    this.currencyId = this.currencies[0].id;
  }
}
