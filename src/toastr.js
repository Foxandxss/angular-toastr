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

  .factory('toastrStack', ['$compile', '$document', function($compile, $document) {
    var container;

    var toastrStack = {
      notify: notify
    };

    return toastrStack;

    function notify(options) {
      container = _getContainer(options);

      var angularDomEl = angular.element('<div toastr-alert></div>');
      angularDomEl.attr('title', 'Hello');
      angularDomEl.attr('message', 'World');
      angularDomEl.attr('toastrType', 'success');
      var toastrDomEl = $compile(angularDomEl)(options.scope);
      console.log(toastrDomEl.prop('outerHTML'));
      container.append(toastrDomEl);
    }

    function _getContainer(options) {
      // TODO: Use options
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
          success: success
        };

        return toastr;

        function success(toastrOptions) {
          toastrStack.notify({
            scope: $rootScope.$new()
          });
        }
      }]
    };

    return toastrProvider;
  });