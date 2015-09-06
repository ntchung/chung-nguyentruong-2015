import ui.View;
import ui.ImageView;
import ui.SpriteView as SpriteView;
import ui.ViewPool as ViewPool;
import animate;
import math.geom.Point as Point;

import src.common.utils as utils;
import src.common.constants as constants;        

exports = Class(ui.View, function(supr) {
   
    this.init = function(opts)
    {         
        supr(this, 'init', [opts]);           
    };  
    
    this.sprOnObtain = function(opts)
    {           
        this._pool = opts.pool;                
        this._target = opts.defender;
        this._attack = opts.attacker._attack;
        this._isAnimationEnded = false;        
    };    
});
