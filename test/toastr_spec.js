describe('toastr', function() {
  var $animate, $document, $rootScope, $timeout;
  var toastr;

  beforeEach(module('toastr'));

  beforeEach(inject(function(_$animate_, _$document_, _$rootScope_, _$timeout_, _toastr_) {
    $animate = _$animate_;
    $document = _$document_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    toastr = _toastr_;
  }));

  beforeEach(function() {
    this.addMatchers({
      toHaveClass: function(cls) {
        this.message = function() {
          return 'Expected "' + this.actual + '"' + (this.isNot ? ' not ' : ' ') + 'to have class "' + cls + '".';
        };

        return this.actual.el.hasClass(cls);
      },

      toHaveToastContainer: function() {
        var containerDomEl = this.actual.find('body > #toast-container');
        return containerDomEl.length === 1;
      },

      toHaveToastOpen: function(noOfToastr) {
        var toastDomEls = this.actual.find('body > #toast-container > .toast');
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

      toHaveToastWithMessage: function(message, toast) {
        var contentToCompare, toastDomEl = this.actual.find('body > #toast-container > .toast').eq(toast || 0);

        this.message = function() {
          return '"Expected "' + angular.mock.dump(toastDomEl) + '" to be open with "' + message + '".';
        };

        contentToCompare = toastDomEl.find('.toast-message').eq(0).html();

        return contentToCompare === message;
      },

      toHaveToastWithTitle: function(title, toast) {
        var contentToCompare, toastDomEl = this.actual.find('body > #toast-container > .toast').eq(toast || 0);

        this.message = function() {
          return '"Expected "' + angular.mock.dump(toastDomEl) + '" to be open with "' + title + '".';
        };

        contentToCompare = toastDomEl.find('.toast-title').eq(0).html();

        return contentToCompare === title;
      }
    });
  });

  afterEach(function() {
    var body = $document.find('body');
    body.find('#toast-container').remove();
  });

  function _findToast(toast) {
    return $document.find('body > #toast-container > .toast').eq(toast || 0);
  }

  // Needed when we want to run the callback of enter or leave.
  function animationFlush() {
    timeoutFlush();
  }

  function checkForEmptyTimeoutQueue() {
    expect(function() {
      $timeout.flush();
    }).toThrow(new Error('No deferred tasks to be flushed'));
  }

  function clickToast(noOfToast) {
    var toast = _findToast(noOfToast);
    toast.click();
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
    var toast;
    if (title) {
      toast = toastr[type](message, title, options);
    } else {
      toast = toastr[type](message, null, options);
    }
    $rootScope.$digest();
    animationFlush();
    return toast;
  }

  function openToasts(noOfToast) {
    for (var i = 0; i < noOfToast; i++) {
      toastr.success('message', 'title');
    }
    $rootScope.$digest();
    animationFlush();
  }

  function timeoutFlush() {
    $timeout.flush();
  }

  describe('basic scenarios', function() {
    it('should be able to open a toast in the container', function() {
      openToasts(1);
      expect($document).toHaveToastOpen(1);
      timeoutFlush();
      expect($document).toHaveToastOpen(0);
    });

    it('should be able to stack more than one toast', function() {
      openToasts(5);
      expect($document).toHaveToastOpen(5);
      timeoutFlush();
      expect($document).toHaveToastOpen(0);
    });

    it('should close a toast upon click', function() {
      openToasts(1);
      expect($document).toHaveToastOpen(1);
      clickToast();
      expect($document).toHaveToastOpen(0);
    });

    it('should contain a title and a message', function() {
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
      timeoutFlush();
      toast = openToast('error', 'foo');
      expect(toast).toHaveType('error');
      timeoutFlush();
      toast = openToast('info', 'foo');
      expect(toast).toHaveType('info');
      timeoutFlush();
      toast = openToast('warning', 'foo');
      expect(toast).toHaveType('warning');
      timeoutFlush();
    });

    it('allows to manually close a toast in code', function() {
      var toast = openToast('success', 'foo');
      expect($document).toHaveToastOpen(1);
      toastr.close(toast);
      $rootScope.$digest();
      expect($document).toHaveToastOpen(0);
      animationFlush();
      expect($document).not.toHaveToastContainer();
    });

    it('allows to close all toasts at once', function() {
      openToasts(10);
      expect($document).toHaveToastOpen(10);
      toastr.close();
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
      animationFlush();
      expect($document).not.toHaveToastContainer();
    });

    it('is created again if it gets deleted', function() {
      expect($document).not.toHaveToastContainer();
      openToasts(2);
      expect($document).toHaveToastContainer();
      clickToast();
      expect($document).toHaveToastContainer();
      clickToast();
      animationFlush();
      expect($document).not.toHaveToastContainer();
      openToasts(1);
      expect($document).toHaveToastContainer();
    });
  });

  describe('directive behavior', function() {
    it('should not close a toast if hovered', function() {
      openToasts(1);
      hoverToast();
      checkForEmptyTimeoutQueue();
      expect($document).toHaveToastOpen(1);
    });

    it('should close all the toasts but the hovered one', function() {
      openToasts(5);
      hoverToast(2);
      timeoutFlush(); // Closing others...
      checkForEmptyTimeoutQueue();
      expect($document).toHaveToastOpen(1);
    });

    it('should re-enable the timeout of a toast if you leave it', function() {
      openToasts(1);
      hoverToast();
      checkForEmptyTimeoutQueue();
      expect($document).toHaveToastOpen(1);
      leaveToast();
      timeoutFlush();
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
  });
});