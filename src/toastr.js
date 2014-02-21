angular.module('toastr', ['ngAnimate'])

  .directive('toastrAlert', ['$timeout', 'toastr', 'toastrConfig', function($timeout, toastr, toastrConfig) {
    return {
      scope: {
        toastrtype: '@',
        title: '@',
        message: '@',
        index: '@'
      },
      replace: true,
      template: '<div class="{{toastClass}} {{toastrType}}" ng-click="close()">' +
                    '<div ng-if="title" class="{{titleClass}}">{{title}}</div>' +
                    '<div class="{{messageClass}}">{{message}}</div>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.toastrType = attrs.toastrtype || '';
        scope.toastClass = toastrConfig.toastClass;
        scope.titleClass = toastrConfig.titleClass;
        scope.messageClass = toastrConfig.messageClass;

        var timeout = createTimeout(toastrConfig.timeOut);

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
      _setContainer().then(function() {
        var newToastr = {
          index: index++
        };

        var angularDomEl = angular.element('<div toastr-alert></div>');
        if (title) {
          angularDomEl.attr('title', title);
        }
        angularDomEl.attr('message', message);
        angularDomEl.attr('toastrtype', extra.type);
        angularDomEl.attr('index', newToastr.index);

        var toastrDomEl = $compile(angularDomEl)($rootScope);

        newToastr.el = toastrDomEl;

        toastrs.push(newToastr);

        $animate.enter(toastrDomEl, container, null, function() {});
      });
    }

    function remove(toastIndex) {
      var toast = findToast(toastIndex);

      var ind = toastrs.indexOf(toast);

      if (toast) { // Avoid clicking when fading out
        $animate.leave(toast.el);
      }

      toastrs.splice(ind, 1);

      if (container.children().length === 0) {
        container.remove();
        container = null;
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