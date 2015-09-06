import ui.View;
import ui.ImageView;
import ui.SpriteView as SpriteView;
import ui.ViewPool as ViewPool;

import src.battle.BattleProjectile as BattleProjectile;
import src.common.utils as utils;
import src.common.constants as constants;        

exports = Class(BattleProjectile, function(supr) {
   
    this.init = function(opts)
    {         
        supr(this, 'init', [opts]);    
                
        this._spriteView = new SpriteView({
            superview: this,
            width: 48,
            height: 48,
            offsetX: -24,
            offsetY: -48,
            frameRate: 10,
            url: opts.url,            
        });        
        
        this._maxDelay = opts.delay;        
    };  
    
    this.onObtain = function(opts)
    {           
        this.sprOnObtain(opts);
        
        this.updateOpts({        
            x: opts.defender.style.x + (Math.random() * 10) - 5,
            y: opts.defender.style.y + (Math.random() * 10) - 5,
            zIndex: opts.defender.style.zIndex,
            visible: true,
        });
                      
        this._delay = this._maxDelay;
        this._spriteView.stopAnimation();                
    };
    
    this.update = function(dt)
    {            
        if (this._delay <= 0)
        {
            return !this._isAnimationEnded;                        
        }
        else
        {
            // Validate target
            if (this._target && this._target._hp <= 0) 
            {
                this._target = null;
                return false;
            }

            this._delay -= dt;
            if (this._delay <= 0)
            {
                var self = this;
                this._spriteView.startAnimation("go", {
                    callback: function() {
                        self._isAnimationEnded = true;
                        self._spriteView.stopAnimation();
                    }
                });
                
                if (this._target)
                {
                    this._target._hp -= this._attack;
                }
            }
        }
        return true;
    };    
});
