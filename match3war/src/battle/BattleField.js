import ui.View;
import ui.ImageScaleView as ImageScaleView;
import ui.ViewPool as ViewPool;
import ui.SpriteView as SpriteView;
import math.geom.Vec2D as Vec2D;

import src.common.constants as constants;

exports = Class(ui.View, function(supr) {
    
    this.init = function(opts)
    { 
        supr(this, 'init', [opts]);  
        
        this._isActive = false;
        this._model = opts.model;
        this._parent = opts.superview;
        
        var test = new SpriteView({
            superview: this,
            x: 100,
            y: 0,
            width: 128,
            height: 128,
            offsetX: -48,
            offsetY: -96,
            frameRate: 10,
            url: "resources/images/units/pikeman",
			defaultAnimation: "walk"
        });
        
        test.startAnimation("attack", {loop: true});
        
    };
    
    this.newGame = function(opts)
    {
        this._isActive = true;  
    };
    
    this.cleanUp = function()
    {
        this._isActive = false;
    };
    
    this.tick = function(dt)
    {
        if (!this._isActive)
        {
            return;
        }
        
        this.checkPlayerStatus();
    };
    
    this.checkPlayerStatus = function() 
    {
        if (this._model._human._hp <= 0)
        {
            this._parent.cleanUp();
            this._parent.emit('gamescreen:result', false);
            this._isActive = false;
        }
        else if (this._model._enemy._hp <= 0)
        {
            this._parent.cleanUp();
            this._parent.emit('gamescreen:result', true);
            this._isActive = false;
        }
    };
    
});
