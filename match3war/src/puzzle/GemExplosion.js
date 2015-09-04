import ui.View;
import ui.ViewPool as ViewPool;
import ui.ImageView;
import animate;
import math.geom.Point as Point;

import src.common.utils as utils;
import src.common.constants as constants;

exports = Class(ui.ImageView, function(supr) {
   
    this.init = function(opts)
    {         
        opts = merge(opts, {
            anchorX: GLOBAL.gemWidth * 0.5,
            anchorY: GLOBAL.gemHeight * 0.5,
        });
        
        supr(this, 'init', [opts]);                                        
    };  

    this.onObtain = function(opts)
    {
        this._type = opts.type;        
        this.setImage(this.getImageUrl(0));
        
        this.style.x = opts.x;
        this.style.y = opts.y;
        this.style.visible = true;
    };
    
    this.setFrame = function(frameIdx)
    {
        this.setImage(this.getImageUrl(frameIdx));
    }
    
    this.getImageUrl = function(frameIdx)
    {
        return "resources/images/blocks/block_" + utils.zeroFill(2, this._type, '0') + "_pop_" + utils.zeroFill(4, frameIdx + 1, '0') + ".png";
    }
});
