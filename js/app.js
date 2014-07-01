angular.module('app', ['toastr', 'ngAnimate'])

  .factory('randomQuotes', function() {
    var quotes = [
      {
        title: 'Come to Freenode',
        message: 'We rock at <em>#angularjs</em>',
        options: {
          allowHtml: true
        }
      },
      {
        title: 'Looking for bootstrap?',
        message: 'Try ui-bootstrap out!'
      },
      {
        title: 'Wants a better router?',
        message: 'We have you covered with ui-router'
      },
      {
        title: null,
        message: 'Titles are not always needed'
      },
      {
        title: null,
        message: 'Toastr rock!'
      },
      {
        title: 'What about nice html?',
        message: '<strong>Sure you <em>can!</em></strong>',
        options: {
          allowHtml: true
        }
      }
    ];

    var types = ['success', 'error', 'info', 'warning'];

    return {
      quotes: quotes,
      types: types
    }
  })

  .controller('DemoCtrl', function($scope, randomQuotes, toastr, toastrConfig) {
    var openedToasts = [];

    $scope.toast = {
      title: '',
      message: ''
    };

    $scope.options = {
      position: 'toast-top-right',
      type: 'success',
      timeout: '5000',
      extendedTimeout: '1000',
      html: false,
      closeButton: false,
      tapToDismiss: true,
      closeHtml: '<button>&times;</button>'
    };

    $scope.$watchCollection('options', function(newValue) {
      toastrConfig.allowHtml = newValue.html;
      toastrConfig.extendedTimeOut = parseInt(newValue.extendedTimeout, 10);
      toastrConfig.positionClass = newValue.position;
      toastrConfig.timeOut = parseInt(newValue.timeout, 10);
      toastrConfig.closeButton = newValue.closeButton;
      toastrConfig.tapToDismiss = newValue.tapToDismiss;
      toastrConfig.closeHtml = newValue.closeHtml;
    });

    $scope.clearLastToast = function() {
      var toast = openedToasts.pop();
      toastr.clear(toast);
    };

    $scope.clearToasts = function() {
      toastr.clear();
    };

    $scope.openPinkToast = function() {
      openedToasts.push(toastr.info('I am totally custom!', 'Happy toast', {
        iconClass: 'toast-pink'
      }));
    };

    $scope.openRandomToast = function() {
      var type = Math.floor(Math.random() * 4);
      var quote = Math.floor(Math.random() * 6);
      var toastType = randomQuotes.types[type];
      var toastQuote = randomQuotes.quotes[quote];
      openedToasts.push(toastr[toastType](toastQuote.message, toastQuote.title, toastQuote.options));
    };

    $scope.openToast = function() {
      openedToasts.push(toastr[$scope.options.type]($scope.toast.message, $scope.toast.title));
    };
  });