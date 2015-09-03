import ui.View;
import ui.ImageView;

import src.common.utils as utils;

exports = Class(ui.ImageView, function(supr) {
   
    this.init = function(opts)
    { 
        opts = merge(opts, {     
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
});
