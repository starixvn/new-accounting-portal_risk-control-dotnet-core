import { Component, Input, Output, OnInit, OnChanges, SimpleChange, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { SpinnerService } from 'nap-components/spinner';
import { GridService } from './grid.service';
import { GridContext } from './grid.model';

@Component({
    selector: 'nap-grid',
    templateUrl: './grid.component.html',
    styleUrls: [
        './grid.component.scss'
    ],
    providers: [
        GridService
    ]
})
export class GridComponent implements OnInit, OnChanges {
    static counter = 0;
    gridId = `grid-${GridComponent.counter}`;
    rendered = false;
    @Input() options: GridOptions;
    @Input() context: GridContext;
    @Output() afterGenerate = new EventEmitter<ElementRef>();
    @ViewChild('grid', { static: true }) grid: ElementRef;

    constructor(
        private readonly gridService: GridService,
        private readonly spinnerService: SpinnerService
    ) {
    }

    ngOnInit() {
        GridComponent.counter++;
        if (_.isNil(this.context)) {
            this.context = {
                isAutoResize: true
            };
        }

        if (this.context.isAutoResize) {
            this.gridService.resizeEvent.subscribe(() => this.resize());
        }
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        const change = changes['options'];
        if (!_.isNil(change) && !_.isNil(change.currentValue)) {
            this.render(change.currentValue);
        }
    }

    private resize() {
        if (this.rendered) {
            setTimeout(() => {
                const gridExpandHeight = this.gridService.calculateGridExpandHeight(this.grid, this.options);
                $(this.grid.nativeElement).fanexGrid('resizeHeight', gridExpandHeight);
            }, 0);
        }
    }

    private render(gridOptions: GridOptions) {
        this.rendered = false;
        setTimeout(() => {
            gridOptions.gridExpandHeight = this.gridService.calculateGridExpandHeight(this.grid, gridOptions);
            this.spinnerService.show();
            $(this.grid.nativeElement).fanexGrid(gridOptions);
            this.spinnerService.hide();
            this.afterGenerate.emit(this.grid);
            this.rendered = true;
        }, 0);
    }
}
