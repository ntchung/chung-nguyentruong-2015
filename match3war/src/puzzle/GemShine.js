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
        supr(this, 'init', [opts]);                                        
    };  

    this.onObtain = function(opts)
    {
        this._type = opts.type;                
        
        this.setImage(this.getImageUrl(0));
                
        this.style.width = opts.width;
        this.style.height = opts.height;
        this.style.anchorX = opts.width * 0.5;
        this.style.anchorY = opts.height * 0.5;
        this.style.visible = true;
    };
    
    this.setFrame = function(frameIdx)
    {
        this.setImage(this.getImageUrl(frameIdx));
    }
    
    this.getImageUrl = function(frameIdx)
    {
        return "resources/images/blocks/shine_icon_" + utils.zeroFill(4, frameIdx + 1, '0') + ".png";
    }
});
