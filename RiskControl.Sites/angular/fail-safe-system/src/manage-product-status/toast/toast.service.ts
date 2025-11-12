import { Injectable } from '@angular/core';
import { MessageType } from './toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    activate(message: string, type: MessageType = MessageType.Danger, autoCloseAfterSeconds?: number) { }

    deactivate() { }
}
