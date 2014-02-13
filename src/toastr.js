angular.module('toastr', [])

  .directive('toastrAlert', ['$timeout', 'toastr', function($timeout, toastr) {
    return {
      scope: {
        toastrtype: '@',
        title: '@',
        message: '@',
        index: '@'
      },
      replace: true,
      template: '<div class="{{toastrClass}}">' +
                    '<div ng-if="title" class="toast-title">{{title}}</div>' +
                    '<div class="toast-message">{{message}}</div>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.toastrClass = attrs.toastrclass || '';

        var timeout = createTimeout();

        element.on('mouseenter', function() {
          if (timeout) {
            $timeout.cancel(timeout);
          }
        });

        element.on('click', function() {
          scope.$apply(function() {
            toastr.remove(scope.index);
          });
        });

        element.on('mouseleave', function() {
          timeout = createTimeout();
        });

        function createTimeout() {
          return $timeout(function() {
            toastr.remove(scope.index);
          }, 4000);
        }
      }
    };
  }])

  .constant('toastrConfig', {
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
  })

  .factory('toastr', ['$compile', '$document', '$rootScope', 'toastrConfig', function($compile, $document, $rootScope, toastrConfig) {
    var container, index = 0, toastrs = [];

    var options = toastrConfig;

    var toastr = {
      error: error,
      info: info,
      remove: remove,
      success: success,
      warning: warning
    };

    return toastr;

    function error(message, title) {
      _notify(message, title, {
        type: options.iconClasses.error
      });
    }

    function info(message, title) {
      _notify(message, title, {
        type: options.iconClasses.info
      });
    }

    function success(message, title) {
      _notify(message, title, {
        type: options.iconClasses.success
      });
    }

    function warning(message, title) {
      _notify(message, title, {
        type: options.iconClasses.warning
      });
    }

    function _getContainer() {
      if(container) return container; // If the container is there, don't create it.

      container = angular.element('<div></div>');
      container.attr('id', options.containerId);
      container.addClass(options.positionClass);
      var body = $document.find(options.target).eq(0);
      body.append(container);
      return container;
    }

    function _notify(message, title, extra) {
      container = _getContainer();

      var newToastr = {
        index: index++
      };

      var angularDomEl = angular.element('<div toastr-alert></div>');
      if (title) {
        angularDomEl.attr('title', title);
      }
      angularDomEl.attr('message', message);
      angularDomEl.attr('toastrclass', extra.type);
      angularDomEl.attr('index', newToastr.index);

      var toastrDomEl = $compile(angularDomEl)($rootScope);

      newToastr.el = toastrDomEl;

      toastrs.push(newToastr);

      container.append(toastrDomEl);
    }

    function remove(toastIndex) {
      var toast = findToast(toastIndex);

      var ind = toastrs.indexOf(toast);

      toast.el.remove();

      toastrs.splice(ind, 1);

      if (container.children().length === 0) {
        container.remove();
      }

      function findToast(toastIndex) {
        for (var i = 0; i < toastrs.length; i++) {
          if (toastrs[i].index == toastIndex) {
            return toastrs[i];
          }
        }
      }
    }
  }]);