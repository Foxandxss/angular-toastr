angular.module('toastr').run([
  '$templateCache',
  function($templateCache) {
    $templateCache.put('template/toastr/toastr.tpl.html',
      '<div class="{{toastClass}} {{toastType}}" ng-click="tapToast()">' +
        '<div ng-if="title" class="{{titleClass}}" ng-click="fn()">{{title}}</div>' +
        '<div ng-switch on="messageType">' +
          '<div ng-switch-when="trusted" class="{{messageClass}}" ng-bind-html="message"></div>' +
          '<div ng-switch-default class="{{messageClass}}">{{message}}</div>' +
        '</div>' +
      '</div>'
    );
}]);