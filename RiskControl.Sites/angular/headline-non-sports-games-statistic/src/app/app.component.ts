import { Component, ComponentFactoryResolver, ComponentRef, Injector, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FilterModel } from './filter/filter.model';
import { ModeContext, ModeController, ModeGenerate, ModeService } from './modes';
import { GridService } from 'components/grid';
import { BreadcrumbService } from './breadcrumb.service';

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
  private componentRef?: ComponentRef<any>;

  private instances: ModeGenerate[] = [];
  private modeContexts: ModeContext[] = [];

  constructor(
    private readonly injector: Injector,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly gridService: GridService,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly modeService: ModeService
  ) { }

  ngOnInit() {
    
  }

  reset() {
    this.removeCurrentComponent();
  }

  generate(filterModel: FilterModel) {
    this.gridService.resizeEvent.observers = [];
    this.removeCurrentComponent();
    const component = this.modeService.getComponent();
    if (component) {
      const modeContext = ModeContext.create('', filterModel, false);
      this.modeContexts = [modeContext];
      this.componentRef = this.createComponent(component, modeContext);
      this.instances = [this.componentRef.instance];
    }
  }

  toggleShowHideFilter() {
    this.isHideFilter = !this.isHideFilter;
    this.gridService.resizeEvent.emit();
  }

  forward(data: object, modeContext: ModeContext) {
    this.removeCurrentComponent();
    this.modeContexts[this.modeContexts.length - 1].data = data;
    const component = this.modeService.getComponent();
    if (component) {
      this.modeContexts.push(modeContext);
      this.componentRef = this.createComponent(component, modeContext);
      this.instances.push(this.componentRef.instance);
    }
  }

  goBack(index: number) {
    this.removeCurrentComponent();
    this.modeContexts = _.take(this.modeContexts, index + 1);
    const modeContext = this.modeContexts[this.modeContexts.length - 1];
    const component = this.modeService.getComponent();
    this.componentRef = this.createComponent(component, modeContext);
    this.instances = _.take(this.instances, index);
    this.instances.push(this.componentRef.instance);
  }

  generateBreadcrumbItems(): string[] {
    const titles: string[] = [];
    this.instances.forEach((instance, index) => {
      const isLast = index === this.instances.length - 1;
      const title = instance.generateTitle(isLast);
      titles.push(title);
    });
    return titles;
  }

  generateBreadcrumb(isHtml: boolean): string {
    const titles = this.generateBreadcrumbItems();
    return isHtml
      ? this.breadcrumbService.generateHtml(titles)
      : this.breadcrumbService.generateText(titles);
  }

  compileBreadcrumb(element: HTMLElement) {
    this.breadcrumbService.compileBreadcrumb(element, index => this.goBack(index));
  }

  private createComponent(component: Type<ModeGenerate>, modeContext: ModeContext): ComponentRef<ModeGenerate> {
    const options = {
      providers: [
        { provide: ModeController, useValue: this },
        { provide: ModeContext, useValue: modeContext }],
      parents: this.injector
    };
    const componentInjector = Injector.create(options);
    const contentComponentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    return this.container.createComponent(contentComponentFactory, 0, componentInjector);
  }

  private removeCurrentComponent() {
    if (this.componentRef) {
      this.container.remove(this.container.indexOf(this.componentRef.hostView));
      this.componentRef = undefined;
    }
  }
}
