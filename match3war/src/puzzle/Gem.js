import ui.View;
import ui.ImageView;
import animate;

import src.common.utils as utils;

exports = Class(ui.ImageView, function(supr) {
   
    this.init = function(opts)
    { 
        opts = merge(opts, {  
            anchorX: GLOBAL.gemWidth * 0.5,
            anchorY: GLOBAL.gemHeight * 0.5,
            width: GLOBAL.gemWidth,
            height: GLOBAL.gemHeight,
            image: "resources/images/blocks/icon_block_" + utils.zeroFill(2, opts.type, '0') + ".png",
        });
        
        supr(this, 'init', [opts]);                
        
        this._row = opts.row;
        this._col = opts.col;        
        this.style.x = this._col * GLOBAL.gemWidth;
        this.style.y = this._row * GLOBAL.gemHeight;
    };  
    
    this.animateSelection = function()
    {
        animate(this).clear().now({r: Math.PI * 2, zIndex: 1000.0}, 1000, animate.linear).then({r: 0.0}, 0, animate.linear).then(this.animateSelection);
    }
    
    this.animateUnselection = function()
    {        
        animate(this).now({r: Math.PI * 2}, 300, animate.easeIn).then({r: 0.0}, 0, animate.linear).then({zIndex: 0.0});
    }
});
