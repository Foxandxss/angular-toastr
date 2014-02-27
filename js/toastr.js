angular.module('toastr', [])

  .directive('toast', ['$timeout', 'toastr', function($timeout, toastr) {
    return {
      replace: true,
      template: '<div class="{{toastClass}} {{toastType}}" ng-click="close()">' +
                    '<div ng-if="title" class="{{titleClass}}">{{title}}</div>' +
                    '<div class="{{messageClass}}">{{message}}</div>' +
                '</div>',
      link: function(scope, element, attrs) {
        var timeout;

        scope.toastClass = scope.options.toastClass;
        scope.titleClass = scope.options.titleClass;
        scope.messageClass = scope.options.messageClass;

        scope.init = function() {
          timeout = createTimeout(scope.options.timeOut);
        };

        element.on('mouseenter', function() {
          if (timeout) {
            $timeout.cancel(timeout);
          }
        });

        scope.close = function() {
          toastr.remove(scope.toastId);
        };

        element.on('mouseleave', function() {
          timeout = createTimeout(scope.options.extendedTimeOut);
        });

        function createTimeout(time) {
          return $timeout(function() {
            toastr.remove(scope.toastId);
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
    timeOut: 5000,
    titleClass: 'toast-title',
    toastClass: 'toast'
  })

  .factory('toastr', ['$animate', '$compile', '$document', '$rootScope', 'toastrConfig', '$q', function($animate, $compile, $document, $rootScope, toastrConfig, $q) {
    var container, index = 0, toasts = [];
    var containerDefer = $q.defer();

    var toastr = {
      clear: clear,
      error: error,
      info: info,
      remove: remove,
      success: success,
      warning: warning
    };

    return toastr;

    /* Public API */
    function clear(toast) {
      if (toast) {
        remove(toast.toastId);
      } else {
        for (var i = 0; i < toasts.length; i++) {
          remove(toasts[i].toastId);
        }
      }
    }

    function error(message, title, optionsOverride) {
      return _notify({
        iconClass: _getOptions().iconClasses.error,
        message: message,
        optionsOverride: optionsOverride,
        title: title
      });
    }

    function info(message, title, optionsOverride) {
      return _notify({
        iconClass: _getOptions().iconClasses.info,
        message: message,
        optionsOverride: optionsOverride,
        title: title
      });
    }

    function success(message, title, optionsOverride) {
      return _notify({
        iconClass: _getOptions().iconClasses.success,
        message: message,
        optionsOverride: optionsOverride,
        title: title
      });
    }

    function warning(message, title, optionsOverride) {
      return _notify({
        iconClass: _getOptions().iconClasses.warning,
        message: message,
        optionsOverride: optionsOverride,
        title: title
      });
    }

    /* Internal functions */
    function _getOptions() {
      return angular.extend({}, toastrConfig);
    }

    function _setContainer(options) {
      if(container) { return containerDefer.promise; } // If the container is there, don't create it.

      container = angular.element('<div></div>');
      container.attr('id', options.containerId);
      container.addClass(options.positionClass);
      var body = $document.find('body').eq(0);
      $animate.enter(container, body, null, function() {
        containerDefer.resolve();
      });
      return containerDefer.promise;
    }

    function _notify(map) {
      var options = _getOptions();

      var newToast = {
        toastId: index++,
        scope: $rootScope.$new()
      };
      newToast.iconClass = map.iconClass;
      if (map.optionsOverride) {
        options = angular.extend(options, map.optionsOverride);
        newToast.iconClass = map.optionsOverride.iconClass || newToast.iconClass;
      }

      createScope(newToast, map, options);

      newToast.el = createToast(newToast.scope);

      toasts.push(newToast);

      _setContainer(options).then(function() {
        $animate.enter(newToast.el, container, null, function() {
          newToast.scope.init();
        });
      });

      return newToast;

      function createScope(toast, map, options) {
        if (map.title) {
          toast.scope.title = map.title;
        }

        toast.scope.message = map.message;
        toast.scope.toastType = toast.iconClass;
        toast.scope.toastId = toast.toastId;

        toast.scope.options = {
          extendedTimeOut: options.extendedTimeOut,
          messageClass: options.messageClass,
          timeOut: options.timeOut,
          titleClass: options.titleClass,
          toastClass: options.toastClass
        };
      }

      function createToast(scope) {
        var angularDomEl = angular.element('<div toast></div>');
        return $compile(angularDomEl)(scope);
      }
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

      function findToast(toastId) {
        for (var i = 0; i < toasts.length; i++) {
          if (toasts[i].toastId === toastId) {
            return toasts[i];
          }
        }
      }
    }
  }]);