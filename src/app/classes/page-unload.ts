import {HostListener} from "@angular/core";

/**
 * This class allows us to react if the page is 'closed'. We can
 * ask for confirmation, but also cleanup any stuf, like unsubscribe
 * from timers or other events we have subscribed to.
 * @class PageUnload
 */
export abstract class PageUnload {

    /**
     * Override this method to cleanup stuff or even ask for confirmation.
     * @returns True if the page can be 'closed' without user confirmation.
     */
    abstract  canUnload(): boolean;

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canUnload()) {
            if ($event.preventDefault) {
                $event.preventDefault();
            }
            $event.returnValue = true;
        }
    }
}
