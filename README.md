# Angular Toastr
**angular-toastr** is a port of [CodeSeven/toastr](https://github.com/CodeSeven/toastr)

The goal is to provide the same API than the original one but without jQuery and using all the angular power.

## Todo

There is an [issue](https://github.com/Foxandxss/angular-toastr/issues/1) with a list of all the stuff I want to do next.

## Demo and instructions

* TODO

## Installation

Grab the latest [release](https://github.com/Foxandxss/angular-toastr/releases) and add both the `css` and `javascript` file:

```html
<link rel="stylesheet" type="text/css" href="angular-toastr.css" />
<script type="text/javascript" src="angular-toastr.js"></script>
```

If you want animations, doesn't forget to add `angular-animate`.

Then add `toastr` to your modules dependencies:

```javascript
angular.module('app', ['toastr'])
```

`bower/npm/...` packages coming soon.

## Building

If you want to build from master, you need to:

```
$ npm install -g grunt-cli
$ grunt && grunt prod
```

Grab the compressed files under `/dist` and the dev files at `/gen`.

## Contributing

For contributing in this project, you need to create a pull request containing both your code and tests.

To create a proper patch I suggest:

```
$ npm install -g grunt-cli testem
$ grunt watch
```

And in another terminal:

```
$ testem -f config/testem.json
```

Then you can see if you have your new tests pass.

## Credits

All the credits for the guys at [CodeSeven/toastr](https://github.com/CodeSeven/toastr) for creating the original implementation.

## License

Mit License: [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)