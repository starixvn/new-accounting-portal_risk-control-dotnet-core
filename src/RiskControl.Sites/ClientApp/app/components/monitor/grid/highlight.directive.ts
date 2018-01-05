import { Directive, Input, HostListener, Renderer, ElementRef, OnChanges } from '@angular/core';

@Directive({
    selector: 'tr[napHighlight]'
})
export class HighlightDirective implements OnChanges {
    // tslint:disable-next-line:no-input-rename
    @Input('napHighlight') isHighlight: boolean;

    constructor(
        private renderer: Renderer,
        private elementRef: ElementRef
    ) { }

    ngOnChanges() {
        if (this.isHighlight) {
            this.setHighlight();
        } else {
            this.clearHighlight();
        }
    }

    @HostListener('click') onClick() {
        this.clearHighlight();
    }

    private setHighlight() {
        this.renderer.setElementClass(this.elementRef.nativeElement, 'highlight', true);
    }

    private clearHighlight() {
        this.renderer.setElementClass(this.elementRef.nativeElement, 'highlight', false);
    }
}
