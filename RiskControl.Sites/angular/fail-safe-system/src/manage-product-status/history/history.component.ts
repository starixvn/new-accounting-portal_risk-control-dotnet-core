import { Component } from '@angular/core';
import { HistoryModel } from './history.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  data: HistoryModel[] | undefined;
  productName = '';
  constructor(public readonly activeModal: NgbActiveModal,
  ) { }

}
