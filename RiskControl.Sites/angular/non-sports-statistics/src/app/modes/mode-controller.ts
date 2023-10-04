import { ModeContext } from './mode-context';

export class ModeController {
    forward: (currentData: object, forwardModeContext: ModeContext) => void;
    goBack: (index: number) => void;
    generateBreadcrumbItems: () => string[];
    generateBreadcrumb: (isHtml: boolean) => string;
    compileBreadcrumb: (element: HTMLElement) => void;
}
