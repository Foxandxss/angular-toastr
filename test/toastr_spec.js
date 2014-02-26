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
      toHaveToastrContainer: function() {
        var containerDomEl = this.actual.find('body > #toast-container');
        return containerDomEl.length === 1
      },

      toHaveToastrOpen: function(noOfToastr) {
        var toastrDomEls = this.actual.find('body > #toast-container > .toast');
        return toastrDomEls.length === noOfToastr;
      },

      toHaveTitle: function() {
        var title = this.actual.el.find('.toast-title');
        return title.length === 1;
      },

      toHaveType: function(type) {
        var typeClass = 'toast-' + type;
        return this.actual.el.hasClass(typeClass);
      },

      toHaveToastrWithMessage: function(message, toastr) {
        var contentToCompare, toastrDomEl = this.actual.find('body > #toast-container > .toast').eq(toastr || 0);

        this.message = function() {
          return '"Expected "' + angular.mock.dump(toastrDomEl) + '" to be open with "' + message + '".';
        };

        contentToCompare = toastrDomEl.find('.toast-message').eq(0).html();

        return contentToCompare === message;
      },

      toHaveToastrWithTitle: function(title, toastr) {
        var contentToCompare, toastrDomEl = this.actual.find('body > #toast-container > .toast').eq(toastr || 0);

        this.message = function() {
          return '"Expected "' + angular.mock.dump(toastrDomEl) + '" to be open with "' + title + '".';
        };

        contentToCompare = toastrDomEl.find('.toast-title').eq(0).html();

        return contentToCompare === title;
      }
    });
  });

  afterEach(function() {
    var body = $document.find('body');
    body.find('#toast-container').remove();
  });

  function _findToastr(toastr) {
    return $document.find('body > #toast-container > .toast').eq(toastr || 0);
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

  function clickToastr(toastr) {
    var toastr = _findToastr(toastr);
    toastr.click();
    $rootScope.$digest();
  }

  function hoverToastr(toastr) {
    var toastr = _findToastr(toastr);
    toastr.trigger('mouseenter');
  }

  function leaveToastr(toastr) {
    var toastr = _findToastr(toastr);
    toastr.trigger('mouseleave');
  }

  function openToastr(type, message, title) {
    var toast;
    if (title) {
      toast = toastr[type](message, title);
    } else {
      toast = toastr[type](message);
    }
    $rootScope.$digest();
    animationFlush();
    return toast;
  }

  function openToastrs(noOfToastr) {
    for (var i = 0; i < noOfToastr; i++) {
      toastr.success('message', 'title');
    }
    $rootScope.$digest();
    animationFlush();
  }

  function timeoutFlush() {
    $timeout.flush();
  }

  describe('basic scenarios', function() {
    it('should be able to open a toastr in the container', function() {
      openToastrs(1);
      expect($document).toHaveToastrOpen(1);
      timeoutFlush();
      expect($document).toHaveToastrOpen(0);
    });

    it('should be able to stack more than one toastr', function() {
      openToastrs(5);
      expect($document).toHaveToastrOpen(5);
      timeoutFlush();
      expect($document).toHaveToastrOpen(0);
    });

    it('should close a toastr upon click', function() {
      openToastrs(1);
      expect($document).toHaveToastrOpen(1);
      clickToastr();
      expect($document).toHaveToastrOpen(0);
    });

    it('should contain a title and a message', function() {
      openToastr('success', 'World', 'Hello');
      expect($document).toHaveToastrWithMessage('World');
      expect($document).toHaveToastrWithTitle('Hello');
    });

    it('have an optional title', function() {
      openToastrs(5);
      var toast = openToastr('success', 'Hello');
      expect(toast).not.toHaveTitle();
    });

    it('has multiple types of toast', function() {
      var toast = openToastr('success', 'foo');
      expect(toast).toHaveType('success');
      timeoutFlush();
      toast = openToastr('error', 'foo');
      expect(toast).toHaveType('error');
      timeoutFlush();
      toast = openToastr('info', 'foo');
      expect(toast).toHaveType('info');
      timeoutFlush();
      toast = openToastr('warning', 'foo');
      expect(toast).toHaveType('warning');
      timeoutFlush();
    });
  });

  describe('container', function() {
    it('should create a new toastr container when the first toastr is created', function() {
      expect($document).not.toHaveToastrContainer();
      openToastrs(1);
      expect($document).toHaveToastrContainer();
    });

    it('should delete the toastr container when the last toastr is gone', function() {
      expect($document).not.toHaveToastrContainer();
      openToastrs(2);
      expect($document).toHaveToastrContainer();
      clickToastr();
      expect($document).toHaveToastrContainer();
      clickToastr();
      animationFlush();
      expect($document).not.toHaveToastrContainer();
    });

    it('is created again if it gets deleted', function() {
      expect($document).not.toHaveToastrContainer();
      openToastrs(2);
      expect($document).toHaveToastrContainer();
      clickToastr();
      expect($document).toHaveToastrContainer();
      clickToastr();
      animationFlush();
      expect($document).not.toHaveToastrContainer();
      openToastrs(1);
      expect($document).toHaveToastrContainer();
    });
  });

  describe('directive behavior', function() {
    it('should not close a toastr if hovered', function() {
      openToastrs(1);
      hoverToastr();
      checkForEmptyTimeoutQueue();
      expect($document).toHaveToastrOpen(1);
    });

    it('should close all the toastrs but the hovered one', function() {
      openToastrs(5);
      hoverToastr(2);
      timeoutFlush(); // Closing others...
      checkForEmptyTimeoutQueue();
      expect($document).toHaveToastrOpen(1);
    });

    it('should re-enable the timeout of a toastr if you leave it', function() {
      openToastrs(1);
      hoverToastr();
      checkForEmptyTimeoutQueue();
      expect($document).toHaveToastrOpen(1);
      leaveToastr();
      timeoutFlush();
      expect($document).toHaveToastrOpen(0);
    })
  });
});