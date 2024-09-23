import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FilterModel } from './filter/filter.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    '../../node_modules/nap-theme/scss/header.scss',
    './app.component.scss'
  ]
})
export class AppComponent {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  isHideFilter = false;
  private componentRef!: ComponentRef<any>;

  reset() {
    //this.removeCurrentComponent();
  }

  generate(filterModel: FilterModel) {
    // this.gridService.resizeEvent.observers = [];
    // this.removeCurrentComponent();
    // const component = this.modeService.getComponent(filterModel.reportType);
    // if (component) {
    //   const modeContext = ModeContext.create(undefined, filterModel, false);
    //   this.modeContexts = [modeContext];
    //   this.componentRef = this.createComponent(component, modeContext);
    //   this.instances = [this.componentRef.instance];
    // }
  }

  toggleShowHideFilter() {
    this.isHideFilter = !this.isHideFilter;
    //this.gridService.resizeEvent.emit();
  }
}
