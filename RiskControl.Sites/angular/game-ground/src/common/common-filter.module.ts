import { NgModule } from "@angular/core";
import { ProductTreeviewPipe } from "./filter/product-treeview.pipe";

@NgModule({
  imports: [
  ],
  declarations: [ProductTreeviewPipe],
  exports: [ProductTreeviewPipe]
})

export class CommonFilterModule {
}
