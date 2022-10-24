import { Component } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'nap-exclamation',
    templateUrl: 'exclamation.component.html',
    styleUrls: ['exclamation.component.scss']
})
export class ExclamationComponent {
    title: string;

    get visibility(): string {
        return !_.isNil(this.title) ? 'visible' : 'hidden';
    }
}
