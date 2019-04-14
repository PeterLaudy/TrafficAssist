import { Injectable } from '@angular/core';

@Injectable()

/**
 * Simple wrapper class around the speech synthesis API of modern web-browsers.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis| Mozilla} for more information.
 * @class TalkToMeBaby
 */
export class TalkToMeBaby {

    private synth: SpeechSynthesis;

    constructor() {
        this.synth = window.speechSynthesis;
    }

    sayIt(text: string) {
        const speak = new SpeechSynthesisUtterance(text);
        this.synth.speak(speak);
    }

    cancel() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
    }
}
