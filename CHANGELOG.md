# Changelog

## Version 1.0.2

- Fixed an issue where it wouldn't work anymore without `ngAnimate`.

## Version 1.0.1

- Hotfix for npm package.

## Version 1.0.0

- No changes since last beta

## Version 1.0.0-beta.3

- Be able to specify a concrete target for container.
- Using $injector internally to avoid circular dependencies.
- onHidden receives a parameter to see whether a toast was closed by timeout or click.
- Fix an issue with toasts not closing up.

## Version 1.0.0-beta.2

- Fix maxOpened. Now toasts are queued when the max is reached.

## Version 1.0.0-beta.1

- Maximum opened toasts can be limited now.
- Allows to attach an `onShown` and `onHidden` callback.
- Allows toasts to override options without title [9013c4d](https://github.com/Foxandxss/angular-toastr/commit/9013c4d1c7562d2ba5047c1e969a0316eb4e6c1d)

## Version 0.5.2

- Removed the support for IE 8 (in terms of CSS)
- Changed `$timeout` to `$interval` so protractor tests won't fail.

## Version 0.5.1

- newestOnTop, with that you can choose whether to add new toasts on the top or bottom. Top by default.

## Version 0.5.0

- Angular 1.3.x support

## Version 0.4.0

- You can add HTML on the toastr titles.
- You can now override the toast's template.
- Fix issue using toastr with ionic.

## Version 0.3.0

- Now the toasts supports a close button.
- Be able to disable to close on click.

## Version 0.2.4

- Fixes #2 where a toast could remain open for all eternity.

## Version 0.2.0

- You can make an sticky toast if you set the `timeOut` to 0. If you also set `extendedTimeOut` to 0 the sticky won't go away until you click on them.
- Toasts accept custom HTML into them!

## Version 0.1.2

- Animations are now optional
- Removed the possibility to add the toast container where you want to (that will be back in a future)

## Version 0.1.1

- The `close` method has been renamed to `clear` to match the original API

## Version 0.1.0

- Initial release
