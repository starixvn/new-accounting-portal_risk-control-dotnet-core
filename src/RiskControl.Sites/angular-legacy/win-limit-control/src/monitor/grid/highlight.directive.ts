import { Directive, Input, HostListener, ElementRef, OnChanges, Renderer2 } from '@angular/core';

@Directive({
    selector: 'tr[napHighlight]'
})
export class HighlightDirective implements OnChanges {
    // tslint:disable-next-line:no-input-rename
    @Input('napHighlight') isHighlight: boolean;

    constructor(
        private renderer: Renderer2,
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
        this.renderer.addClass(this.elementRef.nativeElement, 'highlight');
    }

    private clearHighlight() {
        this.renderer.removeClass(this.elementRef.nativeElement, 'highlight');
    }
}
