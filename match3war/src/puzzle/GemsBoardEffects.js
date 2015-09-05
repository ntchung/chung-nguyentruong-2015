import ui.View;
import ui.ViewPool as ViewPool;
import animate;
import math.geom.Vec2D as Vec2D;

import src.puzzle.Gem as Gem; 
import src.puzzle.GemExplosion as GemExplosion; 
import src.puzzle.GemShine as GemShine; 
import src.common.constants as constants;

exports = Class(function() {
    
    this.init = function(gemsBoard)
    {
        this._gemExplosionPool = new ViewPool({
            ctor: GemExplosion,
            initCount: 100,
            initOpts: {
                superview: gemsBoard,                
                zIndex: 1000,
                type: 1
            }
        });
        
        this._shinePool = new ViewPool({
            ctor: GemShine,
            initCount: 10,
            initOpts: {
                zIndex: 1100,
                x: 0,
                y: 0,
            }
        });
        
        
        this._gemBoard = gemsBoard;
    };
    
    this.createGemExplosion = function(type, x, y)
    {
        var pool = this._gemExplosionPool;
        
        var explosion = this._gemExplosionPool.obtainView();
        explosion.onObtain({
            type: type,
            x: x,
            y: y,            
            width: GLOBAL.gemWidth,
            height: GLOBAL.gemHeight,
            pool: pool,
        });
    }
    
    this.createHintShine = function(gem)
    {
        if (gem)
        {
            var shine = this._shinePool.obtainView();
            shine.onObtain({
                width: GLOBAL.gemWidth,
                height: GLOBAL.gemHeight,
            });
            
            gem.addSubview(shine);

            var view = this;
            animate(shine)
                .then(function() {shine.setFrame(0)})
                .wait(100)
                .then(function() {shine.setFrame(1)})
                .wait(100)
                .then(function() {shine.setFrame(2)})
                .wait(100)
                .then(function() {shine.setFrame(3)})
                .wait(100)
                .then(function() {shine.setFrame(4)})
                .wait(100)
                .then(function() {shine.setFrame(5)})
                .wait(100)
                .then(function() {
                    shine.removeFromSuperview(shine);
                    view._shinePool.releaseView(shine);
                });
        }
    }
});