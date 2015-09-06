import ui.View;
import ui.TextView as TextView;
import ui.ImageScaleView;
import ui.ImageView;
import ui.resource.loader as loader;

import ui.widget.ButtonView as ButtonView;
import src.common.utils as utils;

exports = Class(ui.ImageScaleView, function(supr) {
    
    this.init = function(opts)
    {
        opts = merge(opts, {
            scaleMethod: 'cover',
            x: 0,
            y: 0,
            image: "resources/images/title_screen.jpg",            
        });
        
        supr(this, 'init', [opts]);                
        
        var view = this;
        
        var loadingView = this.showLoadingAnimation();            
        setTimeout(function() {
            loader.preload(['resources/images/ui', 'resources/images', 'resources/images/blocks'], function() {
                loadingView.hide();
                view.build();
            }); 
        }, 1);
    };       
    
    this.showLoadingAnimation = function()
    {
        var screenWidth = GLOBAL.viewWidth;
        var screenHeight = GLOBAL.viewHeight;
        
        return new LoadingSheet({
            superview: this,
            x: (screenWidth / 2 - 64),
            y: (screenHeight / 2 - 64),
            width: 128,
            height: 128,            
        });
    }
    
    this.build = function() {
        var screenWidth = GLOBAL.viewWidth;
        var screenHeight = GLOBAL.viewHeight;
                
        var text = new TextView({
            superview: this,
            x: (screenWidth / 2) - 200,
            y: 40,            
            width: 400,
            height: 100,
            text: "Gems of War",
            size: 80,
            color: "white",
            shadowColor: '#111111',
            shadowWidth: 4
        });
        
        var view = this;
        
        // Show buttons
        var startButton = new ButtonView({
            superview: this,
            x: 20,
            y: (screenHeight / 3),
            width: 220,
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
                shadowColor: "#111111",
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
            image: "resources/images/ui/time_icon_0001.png"
        });
        
        supr(this, "init", [opts]);
        
        this._dt = 0;
        this._index = 0;        
    }
    
    this.tick = function(dt) {        
        this._dt += dt;
        if (this._dt > 50) 
        {
            this._dt %= 50;
            
            this._index = (this._index + 1) % 14;
            this.setImage("resources/images/ui/time_icon_" + utils.zeroFill(4, this._index + 1, '0') +".png");            
        }
    }
});