import { Component, OnInit } from '@angular/core';
import { ModalContext } from 'components/modal';

@Component({
  selector: 'app-save-filter',
  templateUrl: './save-filter.component.html',
  styleUrls: ['./save-filter.component.scss']
})
export class SaveFilterComponent implements OnInit {
  filterName: string = '';

  constructor(private readonly modalContext: ModalContext) { }

  ngOnInit(): void {
  }

  close() {
    this.modalContext.close();
  }

  onSave() {
    
  }

}
