angular.module('toastr', [])

  .directive('toastrAlert', function() {
    return {
      scope: {
        toastrtype: '@',
        title: '@',
        message: '@'
      },
      replace: true,
      template: '<div class="{{toastrClass}}">' +
                    '<div class="toast-title">{{title}}</div>' +
                    '<div class="toast-message">{{message}}</div>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.toastrClass = attrs.toastrtype || '';
      }
    };
  })

  .provider('toastr', function() {
    var toastrProvider = {
      options: {
        containerId: 'toast-container',
        iconClasses: {
          error: 'toast-error',
          info: 'toast-info',
          success: 'toast-success',
          warning: 'toast-warning'
        },
        positionClass: 'toast-top-right',
        target: 'body',
        toastClass: 'toast'
      },

      $get: ['$compile', '$document', '$rootScope', '$timeout', function($compile, $document, $rootScope, $timeout) {
        var container;

        var toastr = {
          error: error,
          info: info,
          success: success,
          warning: warning
        };

        return toastr;

        function error(message, title) {
          _notify(message, title, {
            type: toastrProvider.options.iconClasses.error
          });
        }

        function info(message, title) {
          _notify(message, title, {
            type: toastrProvider.options.iconClasses.info
          });
        }

        function success(message, title) {
          _notify(message, title, {
            type: toastrProvider.options.iconClasses.success,
            scope: $rootScope.$new()
          });
        }

        function warning(message, title) {
          _notify(message, title, {
            type: toastrProvider.options.iconClasses.warning,
            scope: $rootScope.$new()
          });
        }

        function _getContainer() {
          if(container) return container; // If the container is there, don't create it.

          container = angular.element('<div></div>');
          container.attr('id', toastrProvider.options.containerId);
          container.addClass(toastrProvider.options.positionClass);
          var body = $document.find(toastrProvider.options.target).eq(0);
          body.append(container);
          return container;
        }

        function _notify(message, title, options) {
          container = _getContainer();

          var angularDomEl = angular.element('<div toastr-alert></div>');
          angularDomEl.attr('title', title);
          angularDomEl.attr('message', message);
          angularDomEl.attr('toastrType', options.type);
          var toastrDomEl = $compile(angularDomEl)($rootScope.$new());
          container.append(toastrDomEl);

          $timeout(function() {
            removeToast();
          }, 4000);

          function removeToast() {
            toastrDomEl.remove();
            if (container.children().length === 0) {
              container.remove();
            }
          }
        }
      }]
    };

    return toastrProvider;
  });