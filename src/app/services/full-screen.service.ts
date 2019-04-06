import { Injectable } from '@angular/core';

@Injectable()

export class FullScreen {

    constructor() { }

    public toggleFullscreen() {
        const doc: any = window.document as Document & {
            exitFullscreen: any;
            mozCancelFullScreen: any;
            webkitExitFullscreen: any;
            msExitFullscreen: any;
        };
        const fsElement = document.getElementById('fullscreen') as HTMLElement & {
            requestFullscreen: any;
            mozRequestFullScreen: any;
            webkitRequestFullscreen: any;
            msRequestFullscreen: any;
        };

        const reqFS = fsElement.requestFullscreen || fsElement.mozRequestFullScreen ||
                      fsElement.webkitRequestFullscreen || fsElement.msRequestFullscreen;
        const cancelFS = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (doc.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement) {
            cancelFS.call(doc);
        } else {
            reqFS.call(fsElement);
        }
    }
}
