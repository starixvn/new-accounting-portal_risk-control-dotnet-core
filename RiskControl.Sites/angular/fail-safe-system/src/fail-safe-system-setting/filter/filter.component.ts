import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product, RuleTitle, SettingCriteria } from './filter.model';
import { FilterService } from './filter.service';
import { TreeviewConfig } from 'ngx-treeview';
import { ToastService } from 'nap-components/toast';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RuleComponent } from '../rule/rule.component';
import { SharedDataService } from '../../common/shared-data.service';
import { RuleAction } from '../../common/constants';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() valueChange = new EventEmitter<SettingCriteria>();
  @Input() hasHostPermission: boolean = false;
  ruleTitleItems: RuleTitle[] = [];
  selectedRuleTitles: number[] = [];

  productItems: Product[] = [];
  selectedProducts: number[] = [];

  public itemConfig = TreeviewConfig.create({
    hasFilter: true,
    hasAllCheckBox: true,
    hasCollapseExpand: false,
    maxHeight: 500
  });

  constructor(private readonly filterService: FilterService,
    private readonly toastService: ToastService,
    private readonly modalService: NgbModal,
    private readonly sharedDataService: SharedDataService
  ) { }

  ngOnInit(): void {
    this.filterService.getRuleTitles().subscribe(ruleTitles => this.ruleTitleItems = ruleTitles);
    this.filterService.getProducts().subscribe(products => this.productItems = products);
    this.sharedDataService.selectedRuleData$.subscribe( rule => {
      if (rule !== RuleAction.None) {
        this.updateRuleTitleFilter();
      }
    })
  }

  search(): void {
    if (this.isValid()) {
      const criteria: SettingCriteria = {
        productIdList: this.selectedProducts.join(','),
        constantKeyList: this.selectedRuleTitles.join(',')
      };
      this.valueChange.emit(criteria);
    }
  }

  addNewRule(): void {
    this.filterService.getProducts().subscribe(products => {
      const modalRef = this.modalService.open(RuleComponent, { backdrop: 'static', windowClass: 'modal-auto-size' });
      const component: RuleComponent = modalRef.componentInstance;
      component.productItems = products;
      component.isEdit = false;
    });
    
  }

  private updateRuleTitleFilter(): void {
    this.filterService.getRuleTitles().subscribe(rules => {
      if (this.ruleTitleItems.length === this.selectedRuleTitles.length) {
        this.ruleTitleItems = rules;
      } else {
        rules.forEach(r => {
           r.checked = this.selectedRuleTitles.indexOf(r.constantKey) > -1;
        });
        this.ruleTitleItems = rules;
      }
    });
  }

  private isValid(): boolean {
    if (this.selectedRuleTitles.length <= 0) {
      this.toastService.activate('Please select at least one Rule title!');
      return false;
    }

    if (this.selectedProducts.length <= 0) {
      this.toastService.activate('Please select at least one Product!');
      return false;
    }

    return true;
  }

}
