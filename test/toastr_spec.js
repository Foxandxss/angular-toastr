describe('toastr', function() {
  var $animate, $document, $rootScope, $timeout, $interval;
  var toastr, toastrConfig, originalConfig = {};

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));
  beforeEach(module('toastr'));

  beforeEach(inject(function(_$animate_, _$document_, _$rootScope_, _$interval_, _$timeout_, _toastr_, _toastrConfig_) {
    $animate = _$animate_;
    $document = _$document_;
    $rootScope = _$rootScope_;
    $interval = _$interval_;
    $timeout = _$timeout_;
    toastr = _toastr_;
    angular.extend(originalConfig, _toastrConfig_);
    toastrConfig = _toastrConfig_;
  }));

  afterEach(function() {
    var body = $document.find('body');
    body.find('#toast-container').remove();
    angular.extend(toastrConfig, originalConfig);
  });

  beforeEach(function() {
    this.addMatchers({
      toHaveA: function(tag) {
        var el = this.actual.el.find(tag);
        return el.length > 0;
      },

      toHaveButtonWith: function(buttonText) {
        var buttonDomEl = this.actual.el.find('.toast-close-button');
        return buttonDomEl.text() === buttonText;
      },

      toHaveClass: function(cls) {
        this.message = function() {
          return 'Expected "' + this.actual + '"' + (this.isNot ? ' not ' : ' ') + 'to have class "' + cls + '".';
        };

        return this.actual.el.hasClass(cls);
      },

      toHaveToastContainer: function(target) {
        target = target || 'body';
        var containerDomEl = this.actual.find(target + ' > #toast-container');
        return containerDomEl.length === 1;
      },

      toHaveToastOpen: function(noOfToastr, target) {
        target = target || 'body';
        var toastDomEls = this.actual.find(target + ' > #toast-container > .toast');
        return toastDomEls.length === noOfToastr;
      },

      toHaveTitle: function() {
        var title = this.actual.el.find('.toast-title');
        return title.length === 1;
      },

      toHaveType: function(type) {
        var typeClass = 'toast-' + type;
        return this.actual.el.hasClass(typeClass);
      },

      toHaveToastWithMessage: function(message, toast, target) {
        target = target || 'body';
        var found;
        var contentToCompare, toastsDomEl = this.actual.find(target + ' > #toast-container > .toast');

        this.message = function() {
          if (toast) {
            return 'Expected the toast on position "' + toast + '" to have the message: "' + message + '".';
          }
          return '"Expected a toast to be open with "' + message + '".';
        };

        if (toast) {
          contentToCompare = toastsDomEl.eq(toast).find('.toast-message').eq(0).html();

          found = contentToCompare === message;
        } else {
          for (var i = 0, l = toastsDomEl.length; i < l; i++) {
            contentToCompare = toastsDomEl.eq(i).find('.toast-message').eq(0).html();

            found = contentToCompare === message;

            if (found) {
              break;
            }
          }
        }

        return found;
      },

      toHaveToastWithTitle: function(title, toast, target) {
        target = target || 'body';
        var found;
        var contentToCompare, toastsDomEl = this.actual.find(target + ' > #toast-container > .toast');

        this.message = function() {
          if (toast) {
            return 'Expected the toast on position "' + toast + '" to have the title: "' + title + '".';
          }
          return '"Expected a toast to be open with "' + title + '".';
        };

        if (toast) {
          contentToCompare = toastsDomEl.eq(toast).find('.toast-title').eq(0).html();

          found = contentToCompare === title;
        } else {
          for (var i = 0, l = toastsDomEl.length; i < l; i++) {
            contentToCompare = toastsDomEl.eq(i).find('.toast-title').eq(0).html();

            found = contentToCompare === title;

            if (found) {
              break;
            }
          }
        }

        return found;
      }
    });
  });

  function _findToast(toast, target) {
    target = target || 'body';
    return $document.find(target + ' > #toast-container > .toast').eq(toast || 0);
  }

  function _findToastCloseButton(toast, target) {
    target = target || 'body';
    return $document.find(target + ' > #toast-container > .toast > .toast-close-button').eq(toast || 0);
  }

  // Needed when we want to run the callback of enter or leave.
  function animationFlush() {
    $animate.triggerCallbackPromise();
  }

  function clickToast(noOfToast) {
    var toast = _findToast(noOfToast);
    toast.click();

    $rootScope.$digest();
    $animate.triggerCallbackPromise();
  }

  function clickToastCloseButton(noOfToast) {
    var toastCloseButton = _findToastCloseButton(noOfToast);
    toastCloseButton.click();
    $rootScope.$digest();
  }

  function hoverToast(noOfToast) {
    var toast = _findToast(noOfToast);
    toast.trigger('mouseenter');
  }

  function leaveToast(noOfToast) {
    var toast = _findToast(noOfToast);
    toast.trigger('mouseleave');
  }

  function openToast(type, message, title, options) {
    var toast = toastr[type](message, title, options);

    $rootScope.$digest();
    animationFlush();

    return toast;
  }

  function openToasts(noOfToast, optionsOverride) {
    for (var i = 0; i < noOfToast; i++) {
      toastr.success('message', 'title', optionsOverride);
    }
    $rootScope.$digest();
    animationFlush();
  }

  function intervalFlush(millis) {
    $interval.flush(millis || 5000);
  }

  describe('basic scenarios', function() {
    it('should be able to open a toast in the container', function() {
      openToasts(1);
      expect($document).toHaveToastOpen(1);
      intervalFlush();
      expect($document).toHaveToastOpen(0);
    });

    it('should be able to stack more than one toast', function() {
      openToasts(5);
      expect($document).toHaveToastOpen(5);
      intervalFlush();
      expect($document).toHaveToastOpen(0);
    });

    it('should close a toast upon click', function () {
      openToasts(1);
      expect($document).toHaveToastOpen(1);
      clickToast();
      expect($document).toHaveToastOpen(0);
    });

    it('should not close a toast with !tapToDismiss upon click', function () {
      openToasts(1, { tapToDismiss: false });
      expect($document).toHaveToastOpen(1);
      clickToast();
      expect($document).toHaveToastOpen(1);
    });

    it('should close a toast clicking the close button', function () {
      openToasts(1, { tapToDismiss: false, closeButton: true });
      expect($document).toHaveToastOpen(1);
      clickToastCloseButton();
      expect($document).toHaveToastOpen(0);
    });

    it('should contain a title and a message', function () {
      openToast('success', 'World', 'Hello');
      expect($document).toHaveToastWithMessage('World');
      expect($document).toHaveToastWithTitle('Hello');
    });

    it('have an optional title', function() {
      openToasts(5);
      var toast = openToast('success', 'Hello');
      expect(toast).not.toHaveTitle();
    });

    it('has multiple types of toasts', function() {
      var toast = openToast('success', 'foo');
      expect(toast).toHaveType('success');
      intervalFlush();
      toast = openToast('error', 'foo');
      expect(toast).toHaveType('error');
      intervalFlush();
      toast = openToast('info', 'foo');
      expect(toast).toHaveType('info');
      intervalFlush();
      toast = openToast('warning', 'foo');
      expect(toast).toHaveType('warning');
      intervalFlush();
    });

    it('allows to manually close a toast in code', function() {
      var toast = openToast('success', 'foo');
      expect($document).toHaveToastOpen(1);
      toastr.clear(toast);
      $rootScope.$digest();
      expect($document).toHaveToastOpen(0);
      animationFlush();
      expect($document).not.toHaveToastContainer();
    });

    it('allows to close all toasts at once', function() {
      openToasts(10);
      expect($document).toHaveToastOpen(10);
      toastr.clear();
      $rootScope.$digest();
      expect($document).toHaveToastOpen(0);
      animationFlush();
      expect($document).not.toHaveToastContainer();
    });
  });

  describe('container', function() {
    it('should create a new toastr container when the first toast is created', function() {
      expect($document).not.toHaveToastContainer();
      openToasts(1);
      expect($document).toHaveToastContainer();
    });

    it('should delete the toastr container when the last toast is gone', function() {
      expect($document).not.toHaveToastContainer();
      openToasts(2);
      expect($document).toHaveToastContainer();
      clickToast();
      expect($document).toHaveToastContainer();
      clickToast();
      expect($document).not.toHaveToastContainer();
    });

    it('is created again if it gets deleted', function() {
      expect($document).not.toHaveToastContainer();
      openToasts(2);
      expect($document).toHaveToastContainer();
      clickToast();
      expect($document).toHaveToastContainer();
      clickToast();
      expect($document).not.toHaveToastContainer();
      openToasts(1);
      expect($document).toHaveToastContainer();
    });
  });

  describe('directive behavior', function() {
    it('should not close a toast if hovered', function() {
      openToasts(1);
      hoverToast();
      intervalFlush();
      expect($document).toHaveToastOpen(1);
    });

    it('should close all the toasts but the hovered one', function() {
       openToasts(5);
       hoverToast(2);
       intervalFlush(); // Closing others...
       intervalFlush();
       expect($document).toHaveToastOpen(1);
    });

    it('should re-enable the timeout of a toast if you leave it', function() {
       openToasts(1);
       hoverToast();
       intervalFlush();
       expect($document).toHaveToastOpen(1);
       leaveToast();
       intervalFlush();
       expect($document).toHaveToastOpen(0);
    });
  });

  describe('options overriding', function() {
    it('can change the type of the toast', function() {
      var options = {
        iconClass: 'toast-pink'
      };
      var toast = openToast('success', 'message', 'title', options);
      expect(toast).toHaveClass(options.iconClass);
    });

    it('can override the toast class', function() {
      var options = {
        toastClass: 'my-toast'
      };
      var toast = openToast('error', 'message', 'title', options);
      expect(toast).toHaveClass(options.toastClass);
    });

    it('can make a toast stick until is clicked or hovered (extended timeout)', function() {
       var options = {
         timeOut: 0
       };
       openToast('info', 'I don\'t want to go...', options);
       intervalFlush();
       expect($document).toHaveToastOpen(1);
       clickToast();
       expect($document).toHaveToastOpen(0);

       openToast('info', 'I don\'t want to go...', options);
       intervalFlush();
       expect($document).toHaveToastOpen(1);
       hoverToast();
       leaveToast();
       intervalFlush();
       expect($document).toHaveToastOpen(0);
    });

    it('can make a toast stick until is clicked', function() {
       var options = {
         timeOut: 0,
         extendedTimeOut: 0
       };
       openToast('info', 'I don\'t want to go...', options);
       intervalFlush();
       expect($document).toHaveToastOpen(1);
       hoverToast();
       leaveToast();
       expect($document).toHaveToastOpen(1);
       clickToast();
       expect($document).toHaveToastOpen(0);
    });

    it('can show custom html on the toast message', function() {
      var toast = openToast('success', 'I like to have a <button>button</button>', {
        allowHtml: true
      });
      expect(toast).toHaveA('button');
    });

    it('can show custom html on the toast title', function() {
      var toast = openToast('success', 'I want a surprise', '<button>button</button> Surprise', {
        allowHtml: true
      });
      expect(toast).toHaveA('button');
    });

    it('can limit the maximum opened toasts', function() {
      toastrConfig.maxOpened = 3;
      openToast('success', 'Toast 1');
      openToast('success', 'Toast 2');
      openToast('success', 'Toast 3');
      expect($document).toHaveToastOpen(3);
      openToast('success', 'Toast 4');
      animationFlush();
      expect($document).toHaveToastOpen(3);
      expect($document).not.toHaveToastWithMessage('Toast 1');
      openToast('success', 'Toast 5');
      animationFlush();
      expect($document).toHaveToastOpen(3);
      expect($document).not.toHaveToastWithMessage('Toast 2');
    });

    it('can limit the maximum opened toasts with newestOnTop false', function() {
      toastrConfig.maxOpened = 3;
      toastrConfig.newestOnTop = false;
      openToast('success', 'Toast 1');
      openToast('success', 'Toast 2');
      openToast('success', 'Toast 3');
      expect($document).toHaveToastOpen(3);
      openToast('success', 'Toast 4');
      animationFlush();
      expect($document).toHaveToastOpen(3);
      expect($document).not.toHaveToastWithMessage('Toast 1');
    });

    it('has not limit if maxOpened is 0', function() {
      toastrConfig.maxOpened = 0;
      openToast('success', 'Toast 1');
      openToast('success', 'Toast 2');
      openToast('success', 'Toast 3');
      expect($document).toHaveToastOpen(3);
      openToast('success', 'Toast 4');
      animationFlush();
      expect($document).toHaveToastOpen(4);
      expect($document).toHaveToastWithMessage('Toast 1');
    });

    it('can add the container to a custom target', function() {
      var target = angular.element('<div id="toast-target"/>');
      $document.find('body').append(target);

      var toast = openToast('success', 'toast', { target: '#toast-target' });

      expect($document).toHaveToastContainer('#toast-target');
      expect($document).not.toHaveToastContainer();
    });

  });

  describe('close button', function() {
    it('should contain a close button with × if you add it', function() {
      var toast = openToast('info', 'I have a button', {
        closeButton: true
      });

      expect(toast).toHaveButtonWith('×');
    });

    it('allows custom button text on the close button', function() {
      var toast = openToast('info', 'I have a button', {
        closeButton: true,
        closeHtml: '<button>1</button>'
      });

      expect(toast).toHaveButtonWith('1');
    });

    it('allows custom element as the close button', function() {
      var toast = openToast('info', 'I have a button', {
        closeButton: true,
        closeHtml: '<span>1</span>'
      });

      expect(toast).toHaveButtonWith('1');
    });
  });

  describe('toast order', function() {
    it('adds the newest toasts on top by default', function() {
      var toast1 = openToast('success', 'I will be on the bottom');
      var toast2 = openToast('info', 'I like the top part!');
      expect($document).toHaveToastWithMessage(toast2.scope.message, 0);
      expect($document).toHaveToastWithMessage(toast1.scope.message, 1);
    });

    it('adds the older toasts on top setting newestOnTop to false', function() {
      toastrConfig.newestOnTop = false;

      var toast1 = openToast('success', 'I will be on the top now');
      var toast2 = openToast('info', 'I dont like the bottom part!');
      expect($document).toHaveToastWithMessage(toast2.scope.message, 1);
      expect($document).toHaveToastWithMessage(toast1.scope.message, 0);
    });
  });

  describe('callbacks', function() {
    it('calls the onShown callback when showing a toast', function() {
      var callback = jasmine.createSpy();
      openToasts(1, { onShown: callback });
      expect(callback).toHaveBeenCalled();
    });

    it('calls the onHidden callback after a toast is closed on click', function() {
      var callback = jasmine.createSpy();
      openToasts(1, { onHidden: callback });
      expect(callback).not.toHaveBeenCalled();
      clickToast();
      expect(callback).toHaveBeenCalled();
    });

    it('calls the onHidden callback after a toast is closed by timeout', function() {
      var callback = jasmine.createSpy();
      openToasts(1, { onHidden: callback });
      expect(callback).not.toHaveBeenCalled();
      intervalFlush();
      animationFlush();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('target', function() {
    it('should attach the toast to the target', function() {
      var target = angular.element('<div id="toast-target"/>');
      $document.find('body').append(target);
      toastrConfig.target = '#toast-target';

      var toast = openToast('success', 'messagge');

      expect($document).toHaveToastContainer('#toast-target');
      expect($document).not.toHaveToastContainer();
    });
  });

});
