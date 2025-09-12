import { Injectable } from '@angular/core';

interface Size {
    width?: number;
    height?: number;
}

@Injectable()
export class ModalOptions {
    size?: Size;
    windowClass?: string;
    backdrop?: boolean;
}
