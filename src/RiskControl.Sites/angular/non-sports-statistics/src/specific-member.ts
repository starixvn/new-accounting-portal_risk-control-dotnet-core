import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { SpecificMemberAppModule } from 'app/specific-member-app.module';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SpecificMemberAppModule);
