import { Component, OnInit } from '@angular/core';
import { ModalContext } from 'components/modal';
import { SavedFilterGridModel } from './saved-filter-grid.model';

@Component({
  selector: 'app-saved-filter-grid',
  templateUrl: './saved-filter-grid.component.html',
  styleUrls: ['./saved-filter-grid.component.scss']
})
export class SavedFilterGridComponent implements OnInit {
  data: SavedFilterGridModel;
  hasData: boolean = false;

  constructor(private readonly modalContext: ModalContext) { }

  ngOnInit(): void {
  }

  close() {
    this.modalContext.close();
  }

}
