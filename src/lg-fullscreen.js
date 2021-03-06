var fullscreenDefaults = {
    fullScreen: true
};

function isFullScreen() {
    return (
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
    );
}

var Fullscreen = function(element) {

    this.el = element;

    this.core = window.lgData[this.el.getAttribute('lg-uid')];
    this.core.s = Object.assign({}, fullscreenDefaults, this.core.s);

    this.init();

    return this;
};

Fullscreen.prototype.init = function() {
    var fullScreen = '';
    if (this.core.s.fullScreen) {

        // check for fullscreen browser support
        if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled &&
            !document.mozFullScreenEnabled && !document.msFullscreenEnabled) {
            return;
        } else {
            fullScreen = '<button aria-label="Toggle fullscreen" class="lg-fullscreen lg-icon"></button>';
            this.core.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', fullScreen);
            this.fullScreen();
        }
    }
};

Fullscreen.prototype.requestFullscreen = function() {
    var el = document.documentElement;
    if (el.requestFullscreen) {
        el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    }
};

Fullscreen.prototype.exitFullscreen = function() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};

// https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
Fullscreen.prototype.fullScreen = function() {
    var _this = this;

    utils.on(document, 'fullscreenchange.lgfullscreen webkitfullscreenchange.lgfullscreen mozfullscreenchange.lgfullscreen MSFullscreenChange.lgfullscreen', function() {
        if (utils.hasClass(_this.core.outer, 'lg-fullscreen-on')) {
            utils.removeClass(_this.core.outer, 'lg-fullscreen-on');
        } else {
            utils.addClass(_this.core.outer, 'lg-fullscreen-on');
        }
    });

    utils.on(this.core.outer.querySelector('.lg-fullscreen'), 'click.lg', function() {
        if (isFullScreen()) {
            _this.exitFullscreen();
        } else {
            _this.requestFullscreen();
        }
    });

};

Fullscreen.prototype.destroy = function() {

    // exit from fullscreen if activated
    if(isFullScreen()) {
        this.exitFullscreen();
    }

    utils.off(document, '.lgfullscreen');
};

window.lgModules.fullscreen = Fullscreen;
