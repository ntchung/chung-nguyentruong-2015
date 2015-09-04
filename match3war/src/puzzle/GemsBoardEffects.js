import ui.View;
import ui.ViewPool as ViewPool;
import animate;
import math.geom.Vec2D as Vec2D;

import src.puzzle.Gem as Gem; 
import src.puzzle.GemExplosion as GemExplosion; 
import src.common.constants as constants;

exports = Class(function() {
    
    this.init = function(gemsBoard)
    {
        this._gemExplosionPool = new ViewPool({
            ctor: GemExplosion,
            initCount: 100,
            initOpts: {
                superview: gemsBoard,
                width: GLOBAL.gemWidth,
                height: GLOBAL.gemHeight,
                type: 1
            }
        });
        
    };
    
    this.createGemExplosion = function(type, x, y)
    {
        var explosion = this._gemExplosionPool.obtainView();
        explosion.onObtain({
            type: type,
            x: x,
            y: y
        });
        
        var view = this;
        animate(explosion)
            .wait(100)
            .then(function() {explosion.setFrame(1)})
            .wait(100)
            .then(function() {explosion.setFrame(2)})
            .wait(100)
            .then(function() {
                view._gemExplosionPool.releaseView(explosion);
            });
    }
});