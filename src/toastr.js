angular.module('toastr', ['ngAnimate'])

  .directive('toastrAlert', ['$timeout', 'toastr', 'toastrConfig', function($timeout, toastr, toastrConfig) {
    return {
      replace: true,
      template: '<div class="{{toastClass}} {{toastrtype}}" ng-click="close()">' +
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
    var container, index = 0, toastrs = [];
    var containerDefer = $q.defer();

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

    function _setContainer() {
      if(container) return containerDefer.promise; // If the container is there, don't create it.

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
      var newToastr = {
        index: index++,
        scope: $rootScope.$new()
      };

      var angularDomEl = angular.element('<div toastr-alert></div>');
      if (title) {
        newToastr.scope.title = title;
      }

      newToastr.scope.message = message;
      newToastr.scope.toastrtype = extra.type;
      newToastr.scope.index = newToastr.index;

      var toastrDomEl = $compile(angularDomEl)(newToastr.scope);

      newToastr.el = toastrDomEl;

      toastrs.push(newToastr);

      _setContainer().then(function() {
        $animate.enter(toastrDomEl, container, null, function() {
          newToastr.scope.init();
        });
      });

      return newToastr;
    }

    function remove(toastIndex) {
      var toast = findToast(toastIndex);

      var ind = toastrs.indexOf(toast);

      if (toast) { // Avoid clicking when fading out
        $animate.leave(toast.el, function() {
          toast.scope.$destroy();
          toastrs.splice(ind, 1);
          if (container && container.children().length === 0) {
            container.remove();
            container = null;
            containerDefer = $q.defer();
          }
        });
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