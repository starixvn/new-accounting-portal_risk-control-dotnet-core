import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FilterModel, SettingCriteria } from '../filter/filter.model';
import { GridModel } from './grid.model';
import { GridService } from './grid.service';
import { PaginationService as NgxPaginationService, PaginatePipe } from 'ngx-pagination';
import { PaginationInstance, PaginationService } from 'nap-components/pagination';
import * as _ from 'lodash';
import { FilterService } from '../filter/filter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RuleComponent } from '../rule/rule.component';
import { MessageType, ToastService } from 'nap-components/toast';
import { ConfirmationService } from 'nap-components/confirmation';
import { ProductComponent } from '../product/product.component';
import { SharedDataService } from '../../common/shared-data.service';
import { RuleAction } from '../../common/constants';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnChanges {
  @Input() filterModel: FilterModel | undefined;
  @Input() hasHostPermission: boolean = false;
  gridData: GridModel[] = [];
  displayedModels: GridModel[] | undefined;
  paginationInstance!: PaginationInstance;
  checkAll: boolean = false;
  private paginatePipe: PaginatePipe;

  constructor(private readonly gridService: GridService,
    private readonly paginationService: PaginationService,
    private readonly ngxPaginationService: NgxPaginationService,
    private readonly filterService: FilterService,
    private readonly modalService: NgbModal,
    private readonly toastService: ToastService,
    private readonly confirmationService: ConfirmationService,
    private readonly sharedDataService: SharedDataService
  ) { 
    this.paginatePipe = new PaginatePipe(this.ngxPaginationService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getGridData();
  }

  onPageChange() {
    const displayedModels = this.paginatePipe.transform(this.gridData, this.paginationInstance);
    this.displayedModels = _.cloneDeep(displayedModels);
  }

  private getGridData(): void {
    if (this.filterModel !== undefined) {
      var settingCriteria = {
        productIdList: this.filterModel.productIdList,
        constantKeyList: this.filterModel.constantKeyList
      };
      this.gridService.getSettings(settingCriteria).subscribe(data => {
        this.gridData = data;
        this.paginationInstance = this.paginationService.createPaginationInstance(this.gridData.length);
        this.onPageChange();
      });
      this.displayToast(this.filterModel.action);
    }
  }

  getIndex(index: number): number {
    return index + (this.paginationInstance.currentPage - 1) * this.paginationInstance.itemsPerPage;
  }

  editRule(item: GridModel): void {
    this.filterService.getProducts().subscribe(products => {
      var modalRef = this.modalService.open(RuleComponent, { backdrop: 'static', windowClass: 'modal-auto-size' });
      var component = modalRef.componentInstance as RuleComponent;
      products.forEach(p => p.checked = item.productList.includes(p.productName));
      component.productItems = products;
      component.ruleTitle = item.ruleTitle;
      component.ruleMemberLimit = item.ruleMemberLimit;
      if (item.gameIncome?.length > 0) {
        component.gameIncomeCheckBox = true;
        component.gameIncome = Number(item.gameIncome);
      }
      if (item.gamePayout?.length > 0) {
        component.gamePayoutCheckBox = true;
        component.gamePayout = Number(item.gamePayout);
      }
      component.enableLetstalk = item.enableLetstalk;
      component.enableAutoDisableProduct = item.enableAutoDisableProduct;
      component.constantKey = item.constantKey;
      component.isEdit = true;
      component.isTest = item.isTest;
      component.originalEditRuleCriteria = {
        ruleTitle: item.ruleTitle,
        productIdList: products.filter(p => p.checked).map(p => p.productId).join(','),
        ruleMemberLimit: item.ruleMemberLimit,
        enableLetstalk: item.enableLetstalk,
        enableAutoDisableProduct: item.enableAutoDisableProduct,
        isTest: item.isTest,
        criteriaList: [
          item.gameIncome?.length > 0 ? `1_${item.gameIncome}` : '',
          item.gamePayout?.length > 0 ? `2_${item.gamePayout}` : ''
        ].filter(c => c !== '').join(','),
      };
    });
  }

  checkAllDelete(): void {
    this.checkAll = !this.checkAll;
    this.displayedModels!.forEach(m => m.isDelete = this.checkAll);
  }

  deleteRule(): void {
    const deletedList = this.displayedModels!.filter(f => f.isDelete).map(m => m.constantKey);
    if (deletedList.length === 0) {
      this.toastService.activate('Please select at least one rule!');
    } else {
      this.confirmationService.openContent('Are you sure want to delete the Rule(s)?', () => {
        this.gridService.deleteRules( {constantKeyList: deletedList.join(',')}).subscribe(() => {
          this.sharedDataService.setRuleData(RuleAction.Delete);
        });
      })
    }
  }
  showProduct(productList: string[], ruleTitle: string): void {
      var modalRef = this.modalService.open(ProductComponent, { backdrop: 'static', windowClass: 'modal-auto-size' });
      var component: ProductComponent = modalRef.componentInstance;
      component.products = productList;
      component.title = `${ruleTitle} - Products`;
  }

  private displayToast(rule: RuleAction): void {
      let message = '';
      switch (rule) {
        case RuleAction.Add:
          message = 'The Rule has been added successfully!!!';
          break;
        case RuleAction.Edit:
          message = 'The Rule has been edited successfully!!!';
          break;
        case RuleAction.Delete:
          message = 'The Rule(s) has been deleted successfully!!!';
          break;
        default:
          break;
      }
      this.toastService.activate(message, MessageType.Success);
    }
}
