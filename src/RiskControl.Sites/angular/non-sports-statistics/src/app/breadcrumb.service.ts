import { Injectable } from '@angular/core';

@Injectable()
export class BreadcrumbService {
    generateHtml(list: string[]): string {
        let html = '<ol class="breadcrumb">';
        for (let i = 0; i < list.length; i++) {
            const title = list[i];
            const isLast = i === list.length - 1;
            if (isLast) {
                html += `<li class="breadcrumb-item active">${title}</li>`;
            } else {
                html += `<li class="breadcrumb-item"><a href="javascript:;" data-index="${i}">${title}</a></li>`;
            }
        }

        return html;
    }

    compileBreadcrumb(element: HTMLElement, callbackfn: (index: number) => void) {
        $(element.parentElement).find('li.breadcrumb-item > a').on('click', (event) => {
            const index = parseInt($(event.target).data('index'), 10);
            callbackfn(index);
        }, );
    }

    generateText(list: string[]): string {
        return list.join(' > ');
    }
}
