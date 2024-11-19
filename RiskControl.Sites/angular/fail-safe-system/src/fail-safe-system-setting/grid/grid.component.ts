import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SettingCriteria } from '../filter/filter.model';
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
export class GridComponent implements OnChanges, OnInit {
  @Input() settingCriteria: SettingCriteria | undefined;
  @Input() hasHostPermission: boolean = false;
  gridData: GridModel[] = [];
  displayedModels: GridModel[] = [];
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
  ngOnInit(): void {
    this.sharedDataService.selectedRuleData$.subscribe(rule => {
      if (rule === RuleAction.Edit) {
        
        this.getGridData();
        this.toastService.activate('The Rule has been edited successfully!!!', MessageType.Success);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getGridData();
  }

  onPageChange() {
    const displayedModels = this.paginatePipe.transform(this.gridData, this.paginationInstance);
    this.displayedModels = _.cloneDeep(displayedModels);
  }

  private getGridData(): void {
    if (this.settingCriteria !== undefined) {
      this.gridService.getSettings(this.settingCriteria).subscribe(data => {
        this.gridData = data;
        this.paginationInstance = this.paginationService.createPaginationInstance(this.gridData.length);
        this.onPageChange();
      });
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
      component.constantKey = item.constantKey;
      component.isEdit = true;
    });
  }

  checkAllDelete(): void {
    this.checkAll = !this.checkAll;
    this.displayedModels.forEach(m => m.isDelete = this.checkAll);
  }

  deleteRule(): void {
    const deletedList = this.displayedModels.filter(f => f.isDelete).map(m => m.constantKey);
    if (deletedList.length === 0) {
      this.toastService.activate('Please select at least one rule!');
    } else {
      this.confirmationService.openContent('Are you sure want to delete the Rule(s)?', () => {
        this.gridService.deleteRules( {constantKeyList: deletedList.join(',')}).subscribe(() => {
          this.getGridData();
          this.toastService.activate('The Rule(s) has been deleted successfully!', MessageType.Success);
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
}
