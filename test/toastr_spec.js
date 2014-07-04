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

  function _findToastCloseButton(toast) {
    return $document.find('body > #toast-container > .toast > .toast-close-button').eq(toast || 0);
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

  function openToasts(noOfToast, optionsOverride) {
    for (var i = 0; i < noOfToast; i++) {
      toastr.success('message', 'title', optionsOverride);
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

    it('can make a toast stick until is clicked or hovered (extended timeout)', function() {
      var options = {
        timeOut: 0
      };
      openToast('info', 'I don\'t want to go...', null, options);
      checkForEmptyTimeoutQueue();
      expect($document).toHaveToastOpen(1);
      clickToast();
      expect($document).toHaveToastOpen(0);

      openToast('info', 'I don\'t want to go...', null, options);
      checkForEmptyTimeoutQueue();
      expect($document).toHaveToastOpen(1);
      hoverToast();
      leaveToast();
      timeoutFlush();
      expect($document).toHaveToastOpen(0);
    });

    it('can make a toast stick until is clicked', function() {
      var options = {
        timeOut: 0,
        extendedTimeOut: 0
      };
      openToast('info', 'I don\'t want to go...', null, options);
      checkForEmptyTimeoutQueue();
      expect($document).toHaveToastOpen(1);
      hoverToast();
      leaveToast();
      expect($document).toHaveToastOpen(1);
      clickToast();
      expect($document).toHaveToastOpen(0);
    });

    it('can show custom html on the toast message', function() {
      var toast = openToast('success', 'I like to have a <button>button</button>', null, {
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

  });

  describe('close button', function() {
    it('should contain a close button with × if you add it', function() {
      var toast = openToast('info', 'I have a button', null, {
        closeButton: true
      });

      expect(toast).toHaveButtonWith('×');
    });

    it('allows custom button text on the close button', function() {
      var toast = openToast('info', 'I have a button', null, {
        closeButton: true,
        closeHtml: '<button>1</button>'
      });

      expect(toast).toHaveButtonWith('1');
    });

    it('allows custom element as the close button', function() {
      var toast = openToast('info', 'I have a button', null, {
        closeButton: true,
        closeHtml: '<span>1</span>'
      });

      expect(toast).toHaveButtonWith('1');
    });
  });
});
