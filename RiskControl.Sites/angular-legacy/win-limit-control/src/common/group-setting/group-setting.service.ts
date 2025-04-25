import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpService } from "nap-components/http";
import { GroupSettingComponent } from "./group-setting.component";
import { ProductBetTypeSetting } from "./group-setting.model";

@Injectable()
export class GroupSettingService {
  private productBetTypeSettings: ProductBetTypeSetting[];

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService
  ) {}

  show(productId: number, productName: string) {
    this.queryProductBetTypeSettings(productId).subscribe(
      (productBetTypeSettings) => {
        this.productBetTypeSettings = productBetTypeSettings;
        this.internalShow(productName);
      }
    );
  }

  private internalShow(productName: string) {
    const modalRef = this.modalService.open(GroupSettingComponent, {
      backdrop: "static",
      windowClass: "modal-auto-size",
    });
    const componentInstance: GroupSettingComponent = modalRef.componentInstance;
    componentInstance.updateSettings(this.productBetTypeSettings, productName);
  }

  private queryProductBetTypeSettings(
    productId: number
  ): Observable<ProductBetTypeSetting[]> {
    const url = "api/win-limit-control/group-settings";
    return this.httpService.post<ProductBetTypeSetting[]>(url, {
      cache: false,
      productId: productId,
    });
  }
}
