import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { PageUnload } from './page-unload';

@Injectable()

/**
 * Class which is used in the Angular routing module to be able
 * to call some cleanup code if a page is 'closed'.
 * The page has to extend the PageUnload class.
 * @class CanDeactivatePage
 */
export class CanDeactivatePage  implements CanDeactivate<PageUnload> {

    /**
     * Give the page a chance to cleanup.
     * @param page The page which is about to be 'closed'.
     */
    canDeactivate(page: PageUnload): boolean {
        return page.canUnload();
    }
}
