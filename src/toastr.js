angular.module('toastr', ['ngAnimate'])

  .directive('toast', ['$timeout', 'toastr', 'toastrConfig', function($timeout, toastr, toastrConfig) {
    return {
      replace: true,
      template: '<div class="{{toastClass}} {{toastType}}" ng-click="close()">' +
                    '<div ng-if="title" class="{{titleClass}}">{{title}}</div>' +
                    '<div class="{{messageClass}}">{{message}}</div>' +
                '</div>',
      link: function(scope, element, attrs) {
        var timeout;

        scope.toastClass = toastrConfig.toastClass;
        scope.titleClass = toastrConfig.titleClass;
        scope.messageClass = toastrConfig.messageClass;

        scope.init = function() {
          timeout = createTimeout(toastrConfig.timeOut);
        };

        element.on('mouseenter', function() {
          if (timeout) {
            $timeout.cancel(timeout);
          }
        });

        scope.close = function() {
          toastr.remove(scope.index);
        };

        element.on('mouseleave', function() {
          timeout = createTimeout(toastrConfig.extendedTimeOut);
        });

        function createTimeout(time) {
          return $timeout(function() {
            toastr.remove(scope.index);
          }, time);
        }
      }
    };
  }])

  .constant('toastrConfig', {
    containerId: 'toast-container',
    extendedTimeOut: 1000,
    iconClasses: {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning'
    },
    messageClass: 'toast-message',
    positionClass: 'toast-top-right',
    target: 'body',
    timeOut: 5000,
    titleClass: 'toast-title',
    toastClass: 'toast'
  })

  .factory('toastr', ['$animate', '$compile', '$document', '$rootScope', 'toastrConfig', '$q', function($animate, $compile, $document, $rootScope, toastrConfig, $q) {
    var container, index = 0, toasts = [];
    var containerDefer = $q.defer();

    var options = toastrConfig;

    var toastr = {
      close: close,
      error: error,
      info: info,
      remove: remove,
      success: success,
      warning: warning
    };

    return toastr;

    /* Public API */
    function close(toast) {
      if (toast) {
        remove(toast.index);
      } else {
        for (var i = 0; i < toasts.length; i++) {
          remove(toasts[i].index);
        }
      }
    }

    function error(message, title) {
      return _notify(message, title, {
        type: options.iconClasses.error
      });
    }

    function info(message, title) {
      return _notify(message, title, {
        type: options.iconClasses.info
      });
    }

    function success(message, title) {
      return _notify(message, title, {
        type: options.iconClasses.success
      });
    }

    function warning(message, title) {
      return _notify(message, title, {
        type: options.iconClasses.warning
      });
    }

    /* Internal functions */
    function _setContainer() {
      if(container) { return containerDefer.promise; } // If the container is there, don't create it.

      container = angular.element('<div></div>');
      container.attr('id', options.containerId);
      container.addClass(options.positionClass);
      var body = $document.find(options.target).eq(0);
      $animate.enter(container, body, null, function() {
        containerDefer.resolve();
      });
      return containerDefer.promise;
    }

    function _notify(message, title, extra) {
      var newToast = {
        index: index++,
        scope: $rootScope.$new()
      };

      var angularDomEl = angular.element('<div toast></div>');
      if (title) {
        newToast.scope.title = title;
      }

      newToast.scope.message = message;
      newToast.scope.toastType = extra.type;
      newToast.scope.index = newToast.index;

      var toastrDomEl = $compile(angularDomEl)(newToast.scope);

      newToast.el = toastrDomEl;

      toasts.push(newToast);

      _setContainer().then(function() {
        $animate.enter(toastrDomEl, container, null, function() {
          newToast.scope.init();
        });
      });

      return newToast;
    }

    function remove(toastIndex) {
      var toast = findToast(toastIndex);

      var ind = toasts.indexOf(toast);

      if (toast) { // Avoid clicking when fading out
        $animate.leave(toast.el, function() {
          toast.scope.$destroy();
          toasts.splice(ind, 1);
          if (container && container.children().length === 0) {
            container.remove();
            container = null;
            containerDefer = $q.defer();
          }
        });
      }

      function findToast(toastIndex) {
        for (var i = 0; i < toasts.length; i++) {
          if (toasts[i].index === toastIndex) {
            return toasts[i];
          }
        }
      }
    }
  }]);