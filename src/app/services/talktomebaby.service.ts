import { Injectable } from '@angular/core';

@Injectable()

export class TalkToMeBaby {

    private synth: SpeechSynthesis;

    constructor() {
        this.synth = window.speechSynthesis;
    }

    sayIt(text: string) {
        const speak = new SpeechSynthesisUtterance(text);
        this.synth.speak(speak);
    }
}
