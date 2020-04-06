declare global {
    interface Window {
        _VP_CHECKERS?: ViewportChecker[];
    }
}

export type Action = 'add' | 'remove';

export interface ViewportCheckerOptions {
    classToAdd: string;
    classToRemove: string;
    classToAddForFullView: string;
    removeClassAfterAnimation: boolean;
    offset: number | string,
    repeat: boolean,
    invertBottomOffset: boolean,
    callbackFunction: ((elem: Element, action: Action) => void);
    scrollHorizontal: boolean;
    scrollBox: Window | string;
}

export type ViewportCheckerAttributeOptions = Partial<Pick<ViewportCheckerOptions, 'classToAdd' | 'classToRemove' | 'classToAddForFullView' | 'removeClassAfterAnimation' | 'offset' | 'repeat' | 'scrollHorizontal' | 'invertBottomOffset'>>;

interface BoxSize {
    height: number;
    width: number;
}

export default class ViewportChecker implements EventListenerObject {

    /**
     * Index on which the instance if registered in the global register
     */
    private _registerIndex: number | undefined;

    /**
     * User provided options, merged with default options
     */
    readonly options: ViewportCheckerOptions;

    /**
     * Cached list of element to use.
     */
    private elements: NodeListOf<HTMLElement> | undefined;

    /**
     * Size of the provided scrollBox
     */
    private boxSize: BoxSize = {
        height: 0,
        width: 0
    };

    constructor(readonly query: string, userOptions?: Partial<ViewportCheckerOptions>) {
        // Merge user options with default options
        this.options = {
            classToAdd: 'visible',
            classToRemove: 'invisible',
            classToAddForFullView: 'full-visible',
            removeClassAfterAnimation: false,
            offset: 100,
            repeat: false,
            invertBottomOffset: true,
            callbackFunction: () => void 0,
            scrollHorizontal: false,
            scrollBox: window,
            ...userOptions
        };
    }

    handleEvent(evt: Event): void {
        switch (evt.type) {
            case 'scroll':
                this.check();
                break;
            case 'resize':
                this.recalculateBoxsize();
                this.check();
                break;
        }
    }

    /**
     * Query the document for elements and save them under elements
     */
    attach() {
        // Get elements and calculate box size
        this.elements = document.querySelectorAll<HTMLElement>(this.query);
        this.recalculateBoxsize();

        // Register on global event listeners
        this._registerIndex = registerGlobalInstance(this);

        if (!(this.options.scrollBox instanceof Window)) {
            const box = this.resolveScrollBox();
            box.addEventListener('scroll', this);
        }

        // Perform initial check
        this.check();
    }

    /**
     * Detach checker from elements.
     */
    detach() {
        if (this._registerIndex) {
            unregisterGlobalInstance(this._registerIndex);
            this._registerIndex = undefined;

            if (!(this.options.scrollBox instanceof Window)) {
                const box = this.resolveScrollBox();
                box.removeEventListener('scroll', this);
            }
        }
    }

    /**
     * Returns a reference to the defined scrollbox
     */
    private resolveScrollBox(): Window | HTMLElement {
        if (this.options.scrollBox instanceof Window) {
            return this.options.scrollBox;
        }
        const box = document.querySelector<HTMLElement>(this.options.scrollBox);
        if (!box) {
            throw new Error(`${this.options.scrollBox} does not resolve to an existing DOM Element`);
        }
        return box;
    }

    /**
     * Recalculate and set the box size
     */
    recalculateBoxsize() {
        this.boxSize = this.getBoxSize();
    }

    /**
     * Main method which checks the elements and applies the correct actions to it
     */
    check() {
        let viewportStart = 0;
        let viewportEnd = 0;

        // Set some vars to check with
        if (!this.options.scrollHorizontal) {
            viewportStart = Math.max(
                document.body.scrollTop,
                document.documentElement.scrollTop,
                window.scrollY
            );
            viewportEnd = (viewportStart + this.boxSize.height);
        }
        else {
            viewportStart = Math.max(
                document.body.scrollLeft,
                document.documentElement.scrollLeft,
                window.scrollX
            );
            viewportEnd = (viewportStart + this.boxSize.width);
        }

        // Loop through all given dom elements
        this.elements?.forEach(($obj: HTMLElement) => {
            const objOptions: ViewportCheckerOptions = { ...this.options };

            const attrOptionMap: { [key in keyof ViewportCheckerAttributeOptions]-?: string } = {
                classToAdd: 'vpAddClass',
                classToRemove: 'vpRemoveClass',
                classToAddForFullView: 'vpAddClassFullView',
                removeClassAfterAnimation: 'vpKeepAddClass',
                offset: 'vpOffset',
                repeat: 'vpRepeat',
                scrollHorizontal: 'vpScrollHorizontal',
                invertBottomOffset: 'vpInvertBottomOffset'
            };

            //  Get any individual attribution data and override original
            // options.
            for (const opt in attrOptionMap) {
                const dataKey = attrOptionMap[opt as keyof typeof attrOptionMap];
                const val = $obj.dataset[dataKey];
                if (val) { (objOptions as any)[opt] = val; };
            }

            // If class already exists; quit
            if ($obj.dataset.vpAnimated && !objOptions.repeat) {
                return;
            }

            // Check if the offset is percentage based
            let objOffset: number;
            if (typeof objOptions.offset === 'string') {
                objOffset = objOptions.offset.includes('%') ? (parseInt(objOptions.offset) / 100) * this.boxSize.height : parseInt(objOptions.offset);
            }
            else if (typeof objOptions.offset === 'number') {
                objOffset = objOptions.offset;
            }
            else {
                throw new Error(`Provided objOffet '${objOptions.offset}' can't be parsed. Provide a percentage or absolute number`);
            }

            // Get the raw start and end positions
            let rawStart: number = (!objOptions.scrollHorizontal) ? $obj.getBoundingClientRect().top : $obj.getBoundingClientRect().left;
            let rawEnd: number = rawStart + ((!objOptions.scrollHorizontal) ? $obj.clientHeight : $obj.clientWidth);

            // Add the defined offset
            let elemStart = Math.round(rawStart) + objOffset;
            let elemEnd = elemStart + ((!objOptions.scrollHorizontal) ? $obj.clientHeight : $obj.clientWidth);

            if (objOptions.invertBottomOffset) {
                elemEnd -= (objOffset * 2);
            }

            // Add class if in viewport
            if ((elemStart < viewportEnd) && (elemEnd > viewportStart)) {
                // Remove class
                $obj.classList.remove(...objOptions.classToRemove.split(' '));
                $obj.classList.add(...objOptions.classToAdd.split(' '));

                // Do the callback function. Callback wil send the jQuery object as parameter
                objOptions.callbackFunction($obj, 'add');

                // Check if full element is in view
                if (rawEnd <= viewportEnd && rawStart >= viewportStart) {
                    $obj.classList.add(...objOptions.classToAddForFullView.split(' '));
                }
                else {
                    $obj.classList.remove(...objOptions.classToAddForFullView.split(' '));
                }
                // Set element as already animated
                $obj.dataset.vpAnimated = 'true';

                if (objOptions.removeClassAfterAnimation) {
                    $obj.addEventListener('animationend', () => $obj.classList.remove(...objOptions.classToAdd.split(' ')), {
                        once: true
                    });
                }

                // Remove class if not in viewport and repeat is true
            } else if (objOptions.repeat && objOptions.classToAdd.split(' ').reduce((exists, cls) => exists || $obj.classList.contains(cls), false)) {
                $obj.classList.remove(...objOptions.classToAdd.split(' '));
                $obj.classList.remove(...objOptions.classToAddForFullView.split(' '));

                // Do the callback function.
                objOptions.callbackFunction($obj, "remove");

                // Remove already-animated-flag
                $obj.dataset.vpAnimated = undefined;
            }
        });
    }

    /**
     * Get box size of provided scrollBox
     */
    private getBoxSize(): BoxSize {
        const box = this.resolveScrollBox();
        return (box instanceof Window) ? { height: box.innerHeight, width: box.innerWidth } : { height: box.clientHeight, width: box.clientWidth };
    }
}

/**
 * Register the provided instance on the global window object
 * which allows us to reuse the existing event listeners.
 *
 * The returned index can be used to remove the registered instance
 * from the register
 */
const registerGlobalInstance = (instance: ViewportChecker): number => {
    window._VP_CHECKERS = window._VP_CHECKERS || [];
    return window._VP_CHECKERS.push(instance);
};

/**
 * Removes an instance from the global register
 */
const unregisterGlobalInstance = (index: number): void => {
    window._VP_CHECKERS = window._VP_CHECKERS || [];
    if (window._VP_CHECKERS[index]) {
        window._VP_CHECKERS.splice(index, 1);
    }
};

((window: Window, document: Document) => {
    /**
     * Check elements of registered instances
     */
    const checkElements = () => {
        (window._VP_CHECKERS || []).forEach(i => i.check());
    };

    /**
     * Check elements of registered instances
     */
    const recalculateBoxsizes = () => {
        (window._VP_CHECKERS || []).forEach(i => i.recalculateBoxsize());
    };

    /**
     * Binding the correct event listener is still a tricky thing.
     * People have expierenced sloppy scrolling when both scroll and touch
     * events are added, but to make sure devices with both scroll and touch
     * are handled too we always have to add the window.scroll event
     *
     * @see  https://github.com/dirkgroenen/jQuery-viewport-checker/issues/25
     * @see  https://github.com/dirkgroenen/jQuery-viewport-checker/issues/27
     */
    if ('ontouchstart' in window || 'onmsgesturechange' in window) {
        // Device with touchscreen
        ['touchmove', 'MSPointerMove', 'pointermove'].forEach(e => document.addEventListener(e, checkElements));
    }

    // Always load on window load
    window.addEventListener('load', checkElements, { once: true });

    // Handle resizes
    window.addEventListener('resize', () => {
        recalculateBoxsizes();
        checkElements();
    });
})(window, document);