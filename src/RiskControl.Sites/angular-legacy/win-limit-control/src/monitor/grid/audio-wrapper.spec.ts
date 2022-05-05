import { TestBed } from '@angular/core/testing';
import { AudioWrapper } from './index';

describe('AudioWrapper', () => {
    let audioWrapper: AudioWrapper;
    let audio: HTMLAudioElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AudioWrapper
            ]
        });
        audioWrapper = TestBed.get(AudioWrapper);
        audio = audioWrapper.create('');
    });

    it('should invoke audio play', () => {
        const spy = spyOn(audio, 'play');
        audioWrapper.play();
        expect(spy.calls.any()).toBeTruthy();
    });

    it('should invoke audio pause by pausing', () => {
        const spy = spyOn(audio, 'pause');
        audioWrapper.pause();
        expect(spy.calls.any()).toBeTruthy();
    });

    it('should invoke audio pause by stopping', () => {
        const spy = spyOn(audio, 'pause');
        audioWrapper.stop();
        expect(spy.calls.any()).toBeTruthy();
    });
});
