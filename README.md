# Angular Toastr

[![Code Climate](https://codeclimate.com/github/Foxandxss/angular-toastr.png)](https://codeclimate.com/github/Foxandxss/angular-toastr) [![Build Status](https://travis-ci.org/Foxandxss/angular-toastr.svg?branch=master)](https://travis-ci.org/Foxandxss/angular-toastr) [![devDependency Status](https://david-dm.org/Foxandxss/angular-toastr/dev-status.svg)](https://david-dm.org/Foxandxss/angular-toastr#info=devDependencies)

**NOTE:** For angular 1.2.x support check `angular-1.2` branch or download the `0.4.x` release of `angular-toastr`.

**angular-toastr** is a port of [CodeSeven/toastr](https://github.com/CodeSeven/toastr)

The goal is to provide the same API than the original one but without jQuery and using all the angular power.

## Demo

[Demo](http://foxandxss.github.io/angular-toastr/)

## Installation

Grab the latest [release](https://github.com/Foxandxss/angular-toastr/releases) and add both the `css` and `javascript` file:

```html
<link rel="stylesheet" type="text/css" href="angular-toastr.css" />
<script type="text/javascript" src="angular-toastr.tpls.js"></script>
```

If you want animations, don't forget to add `angular-animate`.

Then add `toastr` to your modules dependencies:

```javascript
angular.module('app', ['ngAnimate', 'toastr'])
```

You can also install `angular-toastr` from bower:

```
$ bower install angular-toastr
```

## Usage

### Basic usage

Toastr usage is very simple, by default it comes with four types of notification messages:

Success:

```javascript
app.controller('foo', function($scope, toastr) {
  toastr.success('Hello world!', 'Toastr fun!');
});
```

![Success Image](http://i.imgur.com/5LTPLFK.png)

Info:

```javascript
app.controller('foo', function($scope, toastr) {
  toastr.info('We are open today from 10 to 22', 'Information');
});
```

![Info Image](http://i.imgur.com/7coIu7q.png)

Error:

```javascript
app.controller('foo', function($scope, toastr) {
  toastr.error('Your credentials are gone', 'Error');
});
```

![Error Image](http://i.imgur.com/sXdKsDK.png)

Warning:

```javascript
app.controller('foo', function($scope, toastr) {
  toastr.warning('Your computer is about to explode!', 'Warning');
});
```

![Warning Image](http://i.imgur.com/k4g8vMz.png)

Apart from that you can customize your basic toasts:

No title:

```javascript
app.controller('foo', function($scope, toastr) {
  toastr.success('I don\'t need a title to live');
});
```

![No Title](http://i.imgur.com/GnwWFo4.png)

#### Closing toasts programmatically:

```javascript
app.controller('foo', function($scope, toastr) {
  toastr.clear([toast]);
});
```

If no toast is passed in, all toasts will be closed.

#### Other options

A toast has a `isOpened` flag to see whether it is opened or not.

### Toastr customization

You can customize the entire library like:

```javascript
app.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    allowHtml: false,
    autoDismiss: false,
    closeButton: false,
    closeHtml: '<button>&times;</button>',
    containerId: 'toast-container',
    extendedTimeOut: 1000,
    iconClasses: {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning'
    },
    maxOpened: 0,    
    messageClass: 'toast-message',
    newestOnTop: true,
    onHidden: null,
    onShown: null,
    onTap: null,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    preventOpenDuplicates: false,
    progressBar: false,
    tapToDismiss: true,
    target: 'body',
    templates: {
	  toast: 'directives/toast/toast.html',
	  progressbar: 'directives/progressbar/progressbar.html'
	},
    timeOut: 5000,
    titleClass: 'toast-title',
    toastClass: 'toast'
  });
});
```

Those are the default values, you can pick what you need from it and override with your values.

* **allowHtml**: Your toast can use custom HTML here (See [Issue 3](https://github.com/Foxandxss/angular-toastr/issues/3))
* **autoDismiss** If set, show only the most recent `maxOpened` toast(s)
* **closeButton**: Whether to display an "X" close button on the toast.
* **closeHtml**: Html element to be used as a close button.
* **containerId**: The name of the container where you want to append your toasts (the container will be created for you).
* **extendedTimeOut**: The timeout after you hover a toast.
* **extraData**: If you override the template, you can pass global extra data to your toasts.
* **iconClasses**: The default type classes for the different toasts.
* **maxOpened**: Maximum number of toasts displayed at once.
* **messageClass**: The class for the toast's message.
* **newestOnTop**: Add new toasts on top of the old one. Put on false to put them on the bottom.
* **onHidden**: A callback function called when a toast gets hidden. It receives a boolean parameter to see whether it was closed via click or not.
* **onShown**: A callback function called when a toast is shown.
* **onTap**: A callback function called when it is clicked.
* **positionClass**: The position where the toasts are added.
* **preventDuplicates**: Prevent duplicates of the last toast.
* **preventOpenDuplicates**: Prevent duplicates of open toasts.
* **progressBar**: A progress bar to see the timeout in real time.
* **tapToDismiss**: Whether the toast should be dismissed when it is clicked.
* **target**: The element to put the toastr container.
* **templates**: To override the default path of the templates.
* **timeOut**: The timeout before the toasts disappear.
* **titleClass**: The class for the toast's title.
* **toastClass**: Base class for toasts.

You can also override options per toast, for example:

Toast with custom HTML (available in both title and message):

```javascript
app.controller('foo', function($scope, toastr) {
  toastr.info('<input type="checkbox" checked> Success!', 'With HTML', {
    allowHtml: true
  });
});
```

![Html Image](http://i.imgur.com/mvz6wcW.png)

Toast with a close button:

```javascript
toastr.success('What a nice button', 'Button spree', {
  closeButton: true
});
```

![Html Image](http://i.imgur.com/yupvey4.png)

Toast with a custom button for apple fans:

```javascript
toastr.info('What a nice apple button', 'Button spree', {
  closeButton: true,
  closeHtml: '<button></button>'
});
```

![Html Image](http://i.imgur.com/TaCm9HG.png)

A pinky custom style (you can also create here new types with `$decorate`):

```javascript
app.controller('foo', function($scope, toastr) {
  toastr.info('I am totally custom!', 'Happy toast', {
    iconClass: 'toast-pink'
  });
});
```

`toast-pink` is a custom class created for the occasion:

```css
.toast-pink {
    background-image: url(...) !important;
    background-color: #fa39c3;
}
```

![Pink image](http://i.imgur.com/jur31Zd.png)

See how we passed a third parameter to the `toast`.

There you can override:

* **allowHtml**: Whether to allow HTML or not in a concrete toast.
* **closeButton**: Putting a close button on the toast.
* **closeHtml**: If you need to override how the close button looks like.
* **extendedTimeOut**: The timeout after you hover it.
* **extraData**: If you override the template, you can pass concrete extra data per toast.
* **iconClass**: For the type class you want to use for the toast.
* **messageClass**: If you want to modify the message look.
* **onHidden**: Function to call when the toast gets hidden. It receives a boolean parameter to see whether it was closed via click or not.
* **onShown**: Function to call when the toast is shown.
* **onTap**: A callback function called when it is clicked.
* **progressBar** Show a progress bar for the toast.
* **tapToDismiss**: If you want a concrete toast to toggle the close on click.
* **timeOut**: For that concrete toast timeout.
* **titleClass**: To override the title class of the toast.
* **toastClass**: For the main toast class.

### Toast template

If you want to use the built-in template, you can use the `angular-toastr.tpls.js` file.

If you decide that you don't want to use the built-in one, you can always use `angular-toastr.js` file and then providing your own template like this:

```javascript
angular.module('yourApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('directives/toast/toast.html',
    "<div>Your template here</div>"
  );
  $templateCache.put('directives/progressbar/progressbar.html',
    "<div>Your progressbar here</div>"
  );
}]);
```

The important part here is to have a key named `templates/toastr/toastr.html`. The module you run it is not important, you just need to do it after you load `toastr`.

**NOTE**: Due some limitations in Angular, you need to have your custom template cached before trying to use it.


## Building

If you want to build from master, you need to:

```
$ npm install -g gulp
$ npm install
$ gulp production
```

Grab the compressed files under `/dist` and the dev files at `/gen`.

----------

## Libraries using `angular-toastr`

* [CodeScaleInc/angular-toastr-flash](https://github.com/CodeScaleInc/angular-toastr-flash) - A library to show flash messages using toasts.

## Credits

All the credits for the guys at [CodeSeven/toastr](https://github.com/CodeSeven/toastr) for creating the original implementation.

## License

Mit License: [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)
