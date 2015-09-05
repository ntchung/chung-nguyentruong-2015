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
        
        this.style.x = opts.x;
        this.style.y = opts.y;
        this.style.width = opts.width;
        this.style.height = opts.height;
        this.style.anchorX = opts.width * 0.5;
        this.style.anchorY = opts.height * 0.5;
        this.style.visible = true;
        
        var explosion = this;
        
        if (this._type < constants.GEM_TYPE_MAGIC) 
        {
            animate(this)
                .then(function() {explosion.setFrame(0)})
                .wait(100)
                .then(function() {explosion.setFrame(1)})
                .wait(100)
                .then(function() {explosion.setFrame(2)})
                .wait(100)
                .then(function() {
                    opts.pool.releaseView(explosion);
                });
        }
        else
        {
            animate(this)
                .then(function() {explosion.setFrame(0)})
                .wait(25)
                .then(function() {explosion.setFrame(1)})
                .wait(25)
                .then(function() {explosion.setFrame(2)})
                .wait(25)
                .then(function() {explosion.setFrame(3)})
                .wait(25)
                .then(function() {explosion.setFrame(4)})
                .wait(25)
                .then(function() {explosion.setFrame(5)})
                .wait(25)
                .then(function() {explosion.setFrame(6)})
                .wait(25)
                .then(function() {explosion.setFrame(7)})
                .wait(25)
                .then(function() {
                    opts.pool.releaseView(explosion);
                });
        }
    };
    
    this.setFrame = function(frameIdx)
    {
        this.setImage(this.getImageUrl(frameIdx));
    }
    
    this.getImageUrl = function(frameIdx)
    {
        return (this._type < constants.GEM_TYPE_MAGIC) ? "resources/images/blocks/block_" + utils.zeroFill(2, this._type, '0') + "_pop_" + utils.zeroFill(4, frameIdx + 1, '0') + ".png"
            : "resources/images/blocks/bomb_icon_" + utils.zeroFill(4, frameIdx + 1, '0') + ".png";        
    }
});
