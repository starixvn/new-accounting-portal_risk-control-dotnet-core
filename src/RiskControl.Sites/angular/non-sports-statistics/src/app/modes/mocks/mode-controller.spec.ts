import { ModeContext, ModeController } from '../index';

export class FakeModeController implements ModeController {
    goBack(index: number) { }

    forward(currentData: any, forwardModeContext: ModeContext) { }

    generateBreadcrumbItems(): string[] { return []; }

    generateBreadcrumb(isHtml: boolean): string { return null; }

    compileBreadcrumb(element: HTMLElement) { }
};
