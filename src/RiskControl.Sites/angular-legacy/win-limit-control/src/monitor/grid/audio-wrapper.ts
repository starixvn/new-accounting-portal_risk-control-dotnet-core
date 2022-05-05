import { Injectable } from '@angular/core';

@Injectable()
export class AudioWrapper {
    private audio: HTMLAudioElement;

    create(source: string): HTMLAudioElement {
        this.audio = new Audio(source);
        return this.audio;
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
    }
}
