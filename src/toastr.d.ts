/// <reference path="../typings/angularjs/angular.d.ts" />

declare module toastr {

    /**
     * The settings that define the look and feel of the toasts
     */
    export interface IOptions {
        /**
         * Should the title and message allow Html tags?
         */
        allowHtml?: boolean;

        /**
         * Should a close button be visible on the toast?
         */
        closeButton?: boolean;

        /**
         * The html template for the close button.
         * Only shown with closeButton is true
         */
        closeHtml?: string;

        /**
         * The id that will be given to the element that the toasts will reside in.
         */
        containerId?: string;

        /**
         * The amount of time in milliseconds to extend the lifetime of the toast after the cursor hovers over it.
         */
        extendedTimeOut?: number;

        /**
         * The css classes to use for the various types of toasts
         */
        iconClasses?: {
            /** Error */
            error?: string

            /** Information */
            info?: string

            /** Success */
            success?: string

            /** Warning */
            warning?: string
        };

        /** The css class that will be applied to the message element */
        messageClass?: string;

        /** Should the newest toast be placed above the existing ones? */
        newestOnTop?: boolean;

        /** The css class that controls the location of the toast */
        positionClass?: string;

        /** Should tapping on the toast remove it? */
        tapToDismiss?: boolean;

        /** The time in milliseconds before the toast disappears */
        timeOut?: number;

        /** The css class that will be applied to the title element */
        titleClass?: string;

        /** The css class that will be applied to the toast element */
        toastClass?: string;
    }

    /**
     * Represents a visible toast
     */
    export interface IToast {
        /** Unique identifier for the toast */
        toastId: number;

        /** 
         * The scope that the toast is using.
         * This is prototypically inherited from $rootScope
         */
        scope: IToastScope;

        /** The css class that defines the icon */
        iconClass: string;

        /** The element that the toast resides in */
        el: ng.IAugmentedJQuery;
    }

    /**
     *  The values that are available on the scope for the toast template to use.
     */
    export interface IToastScope extends ng.IScope {

        /** Is html allowed in the title and message sections */
        allowHtml?: boolean;

        /** The title of the toast */
        title: string;

        /** The message of the toast */
        message: string;

        /** The type of the toast. Defines the 'feel' of the toast */
        toastType: string;

        /** Unique identifier of the toast */
        toastId: number;

        /** Options */
        options: {

            /** The css class to apply to the toast */
            toastClass: string

            /** The css class to apply to the title element */
            titleClass: string

            /** The css class to apply to the message element */
            messageClass: string

            /** The time in milliseconds that the toast will live for */
            timeOut: number
            
            /** The time in milliseconds to extend the destruction of the toast after mouse leave */
            extendedTimeOut: number
            
            /** Should the toast be removed when tapped? */
            tapToDismiss: boolean
            
            /** The html element to use to represent the close button */            
            closeHtml?: string
        }
    }

    export interface IToastrService {

        /** Remove all of the visible toasts*/
        clear();

        /** Removes the toast specified by the given toastId */
        remove(toastId: number);

        /**
         * Show a toast using the error type
        */
        error(text: string, title?: string, options?: IOptions): IToast;

        /**
         * Show a toast using the info type
        */
        info(text: string, title?: string, options?: IOptions): IToast;

        /**
         * Show a toast using the success type
        */
        success(text: string, title?: string, options?: IOptions): IToast;

        /**
         * Show a toast using the warning type
        */
        warning(text: string, title?: string, options?: IOptions): IToast;
    }
}
