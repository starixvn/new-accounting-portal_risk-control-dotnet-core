import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  title: string = '';
  products: string[] = [];

  constructor(private readonly activeModal: NgbActiveModal) { }

  closePopup() {
    this.activeModal.dismiss('Cross click');
  }
}
