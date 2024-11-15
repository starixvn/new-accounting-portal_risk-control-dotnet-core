import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SettingCriteria } from '../filter/filter.model';
import { GridModel } from './grid.model';
import { GridService } from './grid.service';
import { PaginationService as NgxPaginationService, PaginatePipe } from 'ngx-pagination';
import { PaginationInstance, PaginationService } from 'nap-components/pagination';
import * as _ from 'lodash';
import { FilterService } from '../filter/filter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RuleComponent } from '../rule/rule.component';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnChanges {
  @Input() settingCriteria: SettingCriteria | undefined;
  gridData: GridModel[] = [];
  displayedModels: GridModel[] = [];
  paginationInstance!: PaginationInstance;
  private paginatePipe: PaginatePipe;

  constructor(private readonly gridService: GridService,
    private readonly paginationService: PaginationService,
    private readonly ngxPaginationService: NgxPaginationService,
    private readonly filterService: FilterService,
    private readonly modalService: NgbModal
  ) { 
    this.paginatePipe = new PaginatePipe(this.ngxPaginationService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.settingCriteria !== undefined) {
      this.gridService.getSettings(this.settingCriteria).subscribe(data => {
        this.gridData = data;
        this.paginationInstance = this.paginationService.createPaginationInstance(this.gridData.length);
        this.onPageChange();
      });
    }
  }

  onPageChange() {
    const displayedModels = this.paginatePipe.transform(this.gridData, this.paginationInstance);
    this.displayedModels = _.cloneDeep(displayedModels);
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
      component.ruleId = item.ruleId;
      component.isEdit = true;
    });
  }

  checkAllDelete(): void {

  }

  deleteRule(): void {

  }
}
