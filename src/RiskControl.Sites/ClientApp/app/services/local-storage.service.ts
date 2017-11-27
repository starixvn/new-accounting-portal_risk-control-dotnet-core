import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class LocalStorageService {
    constructor( @Inject(PLATFORM_ID) private platformId: Object) {
    }

    setItem(key: string, data: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(key, data);
        }
    }

    getItem(key: string): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(key);
        }

        return null;
    }

    removeItem(key: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(key);
        }
    }
}
