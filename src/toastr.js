angular.module('toastr', [])

  .directive('toastrAlert', function() {
    return {
      scope: {
        title: '@',
        message: '@'
      },
      replace: true,
      template: '<div class="toast {{type}}">' +
                    '<div class="toast-title">{{title}}</div>' +
                    '<div class="toast-message">{{message}}</div>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.type = 'toast-' + attrs.toastrtype || '';
      }
    };
  })

  .factory('toastrStack', ['$compile', '$document', '$timeout', function($compile, $document, $timeout) {
    var container;

    var toastrStack = {
      notify: notify
    };

    return toastrStack;

    function notify(message, title, options) {
      container = _getContainer(options);

      var angularDomEl = angular.element('<div toastr-alert></div>');
      angularDomEl.attr('title', message);
      angularDomEl.attr('message', title);
      angularDomEl.attr('toastrType', options.type);
      var toastrDomEl = $compile(angularDomEl)(options.scope);
      container.append(toastrDomEl);

      $timeout(function() {
        removeToast();
      }, 3000);

      function removeToast() {
        toastrDomEl.remove();
      }
    }

    function _getContainer(options) {
      // TODO: Use options
      if(container) return container; // If the container is there, don't create it.

      container = angular.element('<div></div>');
      container.attr('id', 'toast-container');
      container.addClass('toast-top-right');
      var body = $document.find('body').eq(0);
      body.append(container);
      return container;
    }
  }])

  .provider('toastr', function() {
    var toastrProvider = {
      // TODO: Options

      $get: ['$rootScope', 'toastrStack', function($rootScope, toastrStack) {
        var toastr = {
          error: error,
          info: info,
          success: success,
          warning: warning
        };

        return toastr;

        function error(message, title) {
          toastrStack.notify(message, title, {
            type: 'error',
            scope: $rootScope.$new()
          });
        }

        function info(message, title) {
          toastrStack.notify(message, title, {
            type: 'info',
            scope: $rootScope.$new()
          });
        }

        function success(message, title) {
          toastrStack.notify(message, title, {
            type: 'success',
            scope: $rootScope.$new()
          });
        }

        function warning(message, title) {
          toastrStack.notify(message, title, {
            type: 'warning',
            scope: $rootScope.$new()
          });
        }
      }]
    };

    return toastrProvider;
  });