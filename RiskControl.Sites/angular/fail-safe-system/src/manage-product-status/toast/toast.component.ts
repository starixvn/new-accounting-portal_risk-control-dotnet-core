import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from './toast.service';
import { MessageType } from './toast.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'nap-toast',
    templateUrl: './toast.component.html'
})

export class ToastComponent implements OnInit, OnDestroy {
    message: SafeHtml | undefined;
    type = MessageType.Danger;
    private timer: NodeJS.Timer | undefined;

    constructor(
        private toastService: ToastService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.toastService.activate = this.activate.bind(this);
        this.toastService.deactivate = this.deactivate.bind(this);
    }

    ngOnDestroy() {
        this.clearTimer();
    }

    close() {
        this.message = undefined;
    }

    get alertClass(): string {
        switch (this.type) {
            case MessageType.Success:
                return 'alert-success';
            case MessageType.Info:
                return 'alert-info';
            case MessageType.Warning:
                return 'alert-warning';
            case MessageType.Danger:
                return 'alert-danger';
        }
    }

    private activate(message: string, type: MessageType = MessageType.Danger, autoCloseAfterSeconds?: number): void {
        this.clearTimer();
        this.message = this.sanitizer.bypassSecurityTrustHtml(message);
        this.type = type;
        if (autoCloseAfterSeconds) {
            this.timer = setTimeout(() => {
                this.close();
            }, autoCloseAfterSeconds * 1000);
        }
    }

    private deactivate(): void {
        this.close();
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
    }
}
