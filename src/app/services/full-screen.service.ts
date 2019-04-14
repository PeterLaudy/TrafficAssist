import { Injectable } from '@angular/core';

@Injectable()

/**
 * Simple wrapper class to access the Full Screen API of the browser.
 * @class FullScreen
 */
export class FullScreen {

    constructor() { }

    /**
     * Check if we are in full screen mode or not and then toggle the mode.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API|Mozilla} for more info.
     */
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
