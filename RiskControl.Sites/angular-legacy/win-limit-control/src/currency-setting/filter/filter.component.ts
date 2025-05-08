import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ToastService } from "nap-components/toast";
import { FilterModel } from "./filter.model";
import {
  FilterHelper,
  Product,
  SiteGroup,
  Site,
  Currency,
  FilterService,
  QueryCurrencyModel,
  Group,
  SiteType,
} from "../../common/filter";
import { TreeviewConfig } from "ngx-treeview";

@Component({
  selector: "nap-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
  providers: [FilterService],
})
export class FilterComponent implements OnInit {
  @Output() generate = new EventEmitter<FilterModel>();
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
  currencies: Currency[];
  currencyId: number;
  siteTreeviewConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500,
  });
  selectedSites: number[] = [];
  sitesLength: number = 0;
  groups: Group[];
  groupId = 0;

  constructor(
    private toastService: ToastService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.filterService.queryProducts().subscribe((products) => {
      this.products = products;
      this.productId = 0;
      this.selectedProduct = null;
    });
    this.querySites(0);
  }

  onProductChange() {
    this.productId = this.selectedProduct == null ? 0 : this.selectedProduct.id;
    this.currencyId = 0;
    this.groupId = 0;
    this.querySites(this.productId);
    this.queryGroups(this.productId);
  }

  onSiteChange(siteIds: number[]) {
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
    this.toastService.deactivate();
    if (this.productId === undefined || this.productId === 0) {
      this.toastService.activate("Please select a product");
      return;
    }

    if (this.selectedSites.length === 0) {
      this.toastService.activate("Please select a Site / Licensee");
      return;
    }
    const productName = this.products.filter(
      (product) => product.id === this.productId
    )[0].name;
    const filterModel: FilterModel = {
      productId: this.productId,
      productName: productName,
      multiSite:
        this.selectedSites.length === this.sitesLength
          ? "0"
          : this.selectedSites.join(","),
      isCreditSite: FilterHelper.getSiteType(
        this.siteGroups,
        this.selectedSites
      ),
      currencyId: this.currencyId,
      excludeTestCurrency: false,
      groupId: this.groupId,
    };
    this.generate.emit(filterModel);
  }

  manageSettingGroup(): void {
    const url = window.location.href.replace(
      "CurrencySetting",
      "ManageSettingGroup"
    );
    window.open(url);
  }

  private queryCurrencies(currencyQueryModel: QueryCurrencyModel) {
    this.filterService
      .queryCurrencies(currencyQueryModel)
      .subscribe((currencies) => {
        this.initCurrencies(currencies);
      });
  }

  private queryGroups(productId: number) {
    this.filterService.queryGroups(productId).subscribe((groups) => {
      this.groups = groups;
    });
  }

  private querySites(productId: number) {
    this.filterService.querySites(productId).subscribe((siteGroups) => {
      this.siteGroups = siteGroups;
      this.sitesLength = FilterHelper.countAllSiteItems(this.siteGroups);
    });
  }

  private initCurrencies(currencies: Currency[]): void {
    this.currencies = FilterHelper.insertCurrencyAll(currencies);
    this.currencyId = this.currencies[0].id;
  }
}
