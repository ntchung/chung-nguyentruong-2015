import ui.View;
import ui.TextView as TextView;
import ui.ImageScaleView;
import ui.ImageView;
import ui.resource.loader as loader;

import ui.widget.ButtonView as ButtonView;

exports = Class(ui.ImageScaleView, function(supr) {
    
    this.init = function(opts)
    {
        var view = this;
        
        opts = merge(opts, {
            scaleMethod: 'cover',
            x: 0,
            y: 0,
            image: "resources/images/title_screen.jpg",            
        });
        
        supr(this, 'init', [opts]);                
        
        this.doOnLoad(function() {
            var loadingView = showLoadingAnimation(view);            
            setTimeout(function() {
            loader.preload(['resources/images'], function() {
                loadingView.hide();
                initAfterPreload(view); 
            }); 
            }, 100);
        });
    };       
    
    function showLoadingAnimation(view)
    {
        var screenWidth = GLOBAL.viewWidth;
        var screenHeight = GLOBAL.viewHeight;
        
        return new LoadingSheet({
            superview: view,
            x: (screenWidth / 2 - 64),
            y: (screenHeight / 2 - 64),
            width: 128,
            height: 128,            
        });
    }
    
    function initAfterPreload(view)
    {
        var screenWidth = GLOBAL.viewWidth;
        var screenHeight = GLOBAL.viewHeight;
                
        // Show buttons
        var startButton = new ButtonView({
            superview: view,
            x: 120,
            y: (screenHeight - 120),
            width: 240,
            height: 80,
            images: {
                up: "resources/images/ui/green_button00.png",
                down: "resources/images/ui/green_button01.png"
            },
            text: {
					color: "#FFFFFF",
					size: 30,
					autoFontSize: true,
					autoSize: false,
            },
            title: "Start game",
            on: {
                up: function() {
                    view.emit('titlescreen:start');
                }
            }
        });
        
    }

});

var LoadingSheet = Class(ui.ImageView, function(supr) {
    
    this.init = function(opts) {
        opts = merge(opts, {
            image: "resources/images/ui/coin_animation.png"
        });
        
        supr(this, "init", [opts]);
        
        var map = this.getImage().getMap();        
        this._offsetX = map.x;
        this._sizeX = 40.0; 
        this._index = 0;
        this._dt = 50;
    }
    
    this.tick = function(dt) {
        this._dt += dt;
        if (this._dt > 100) 
        {
            this._dt %= 100;
            
            this._index = (this._index + 1) % 10;
            
            var map = this.getImage().getMap();        
            map.width = this._sizeX;
            map.x = this._offsetX + ((this._index % 10.0) | 0) * this._sizeX;
        }
    }
});