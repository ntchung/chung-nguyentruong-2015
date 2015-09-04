import ui.View;
import ui.ImageView;
import animate;
import math.geom.Point as Point;

import src.common.utils as utils;
import src.common.constants as constants;

exports = Class(ui.View, function(supr) {
   
    this.init = function(opts)
    {         
        supr(this, 'init', [opts]);                
        
        this._gemSprite = new ui.ImageView({  
            superview: this,
            anchorX: GLOBAL.gemWidth * 0.5,
            anchorY: GLOBAL.gemHeight * 0.5,
            width: GLOBAL.gemWidth,
            height: GLOBAL.gemHeight,
        });                                  
    };  
    
    this.onObtain = function(opts)
    {        
        this._type = opts.type;
        this._row = opts.row;
        this._col = opts.col;    
        
        this._gemSprite.setImage(this.getImageUrl());
        
        var originalPosition = this.getOriginalPosition();        
        this.style.x = originalPosition.x;
        this.style.y = originalPosition.y - constants.BOARD_HEIGHT * 1.25;        
        this.style.visible = true;
        
        this.gravityFall();
    }
    
    this.gravityFall = function()
    {
        var originalPosition = this.getOriginalPosition();        
        animate(this).clear().now({x: originalPosition.x, y: originalPosition.y + 5}, 300, animate.easeIn)
            .then({x: originalPosition.x, y: originalPosition.y - 10}, 100, animate.easeOut)
            .then({x: originalPosition.x, y: originalPosition.y}, 100, animate.easeIn);
    }
    
    this.getImageUrl = function()
    {
        return "resources/images/blocks/icon_block_" + utils.zeroFill(2, this._type, '0') + ".png";
    }
    
    this.animateSelection = function()
    {
        this.reposition();
        
        if (this._gemSprite)
        {
            animateGemSelection.call(this);            
        }
    }
    
    this.animateUnselection = function()
    {   
        if (this._gemSprite)
        {
            animateGemUnselection.call(this);
        }
    }
    
    this.reposition = function()
    {
        this.style.x = this._col * GLOBAL.gemWidth;
        this.style.y = this._row * GLOBAL.gemHeight;
    }
    
    this.feintSwap = function(otherGem)
    {
        var originalPosition = this.getOriginalPosition();
        var otherPosition = otherGem.getOriginalPosition();
        
        animate(this).clear()
            .now({x: otherPosition.x, y: otherPosition.y}, 200, animate.linear)
            .then({x: originalPosition.x, y: originalPosition.y}, 200, animate.linear);
    }
    
    this.swap = function(otherGem)
    {        
        var myPosition = this.getOriginalPosition();
        var otherPosition = otherGem.getOriginalPosition();
        
        animate(this).clear()
            .now({x: otherPosition.x, y: otherPosition.y}, 200, animate.linear);
        
        animate(otherGem).clear()
            .now({x: myPosition.x, y: myPosition.y}, 200, animate.linear);
        
        var temp = this._row;
        this._row = otherGem._row;
        otherGem._row = temp;
        
        temp = this._col;
        this._col = otherGem._col;
        otherGem._col = temp;
    }
    
    this.getOriginalPosition = function()
    {
        var x = this._col * GLOBAL.gemWidth;
        var y = this._row * GLOBAL.gemHeight;
        return new Point(x, y);
    }
    
    this.isMatched = function(otherGem)
    {
        return otherGem != null && this._type == otherGem._type;
    }
    
    // Empty
    this.render = function(ctx)
    {
        // This is only a placeholder, the real sprites are children of this.
    }
});

function animateGemSelection()
{
    // Rotate the gem
    animate(this._gemSprite).clear().now({r: Math.PI * 2, zIndex: 1000.0}, 1000, animate.linear).then({r: 0.0}, 0, animate.linear).then(animateGemSelection.bind(this));        
}

function animateGemUnselection()
{
    // Ending the rotation
    animate(this._gemSprite).clear().now({r: Math.PI * 2}, 500 * (Math.PI * 2 - this.style.r) / (Math.PI * 2), animate.easeOut).then({r: 0.0}, 0, animate.linear).then({zIndex: 0.0});   
}

