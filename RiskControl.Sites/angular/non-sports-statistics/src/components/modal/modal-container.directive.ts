import {
  Directive, ViewContainerRef, TemplateRef, ComponentFactory, ComponentFactoryResolver,
  Injector, Renderer2
} from '@angular/core';
import { ModalStackService } from './modal-stack.service';
import { ModalWindowComponent } from './modal-window.component';
import { ModalBackdropComponent } from './modal-backdrop.component';
import { ModalRef } from './modal-ref';
import { ModalContext } from './modal-context';
import { ContentRef } from './content-ref';
import { ModalOptions } from './modal-options';

@Directive({
  selector: '[napModalContainer]',
})
export class ModalContainerDirective {
  private index = 1;
  private readonly windowFactory: ComponentFactory<ModalWindowComponent>;
  private readonly backdropFactory: ComponentFactory<ModalBackdropComponent>;

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly injector: Injector,
    private readonly renderer: Renderer2,
    private readonly modalStackService: ModalStackService,
    private readonly componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.windowFactory = componentFactoryResolver.resolveComponentFactory(ModalWindowComponent);
    this.backdropFactory = componentFactoryResolver.resolveComponentFactory(ModalBackdropComponent);
    modalStackService.registerContainer(this);
  }

  open(content: any, options: ModalOptions, data: Object): ModalRef {
    const activeModal = ModalContext.create(data);
    const contentRef = this.getContentRef(content, options, activeModal);
    const windowComponentRef = this.viewContainerRef.createComponent(this.windowFactory, this.index, this.injector, contentRef.nodes);
    this.index += 1;
    windowComponentRef.instance.options = options;
    const backdropComponentRef = this.viewContainerRef.createComponent(this.backdropFactory, this.index, this.injector);
    this.index += 1;
    const modalRef = new ModalRef(this.viewContainerRef, windowComponentRef, backdropComponentRef, contentRef.viewRef);
    activeModal.close = () => {
      this.index -= 2;
      modalRef.close();
    };
    return modalRef;
  }

  private getContentRef(content: any, options: ModalOptions, context: ModalContext): ContentRef {
    if (!content) {
      return new ContentRef([]);
    } else if (content instanceof TemplateRef) {
      const embeddedViewRef = this.viewContainerRef.createEmbeddedView(content, context);
      return new ContentRef([embeddedViewRef.rootNodes], embeddedViewRef);
    } else if (typeof content === 'string') {
      return new ContentRef([[this.renderer.createText(`${content}`)]]);
    } else {
      const contentComponentFactory = this.componentFactoryResolver.resolveComponentFactory(content);

      const injnectOptions = {
        providers: [
          { provide: ModalContext, useValue: context },
          { provide: ModalOptions, useValue: options }],
        parents: this.injector
      };

      const modalContentInjector = Injector.create(injnectOptions);
      const componentRef = this.viewContainerRef.createComponent(contentComponentFactory, 0, modalContentInjector);
      return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
    }
  }
}
