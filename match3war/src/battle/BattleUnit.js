import ui.View;
import ui.ImageView;
import ui.SpriteView as SpriteView;
import ui.ViewPool as ViewPool;
import animate;
import math.geom.Point as Point;

import src.common.utils as utils;
import src.common.constants as constants;        

UnitState = {
    Idle: 0,
    March: 1,
    Dying: 2,
    Attack: 3,
};

exports = Class(ui.View, function(supr) {
   
    this.init = function(opts)
    {         
        supr(this, 'init', [opts]);                                            
        
        this._spriteView = new SpriteView({
            superview: this,
            width: 128,
            height: 128,
            offsetX: opts.sprOffsetX,
            offsetY: opts.sprOffsetY,
            frameRate: 10,
            url: opts.url,
        });
        
        this._parent = opts.superview;
        this._maxHP = opts.maxHP;        
        this._moveSpeed = opts.moveSpeed;
        this._attack = opts.attack;
        this._attackRange = opts.attackRange;
        this._attackCooldown = opts.attackCooldown;
    };  
    
    this.onObtain = function(opts)
    {           
        this._pool = opts.pool;
        
        this.updateOpts({        
            x: opts.player._positionX,
            y: opts.y,
            zIndex: opts.y,
            scaleX: opts.player._marchDirection,                                    
            visible: true,
        });
        
        this._spriteView.startAnimation("idle", {loop: true});
        
        this._owner = opts.player;
        this._state = UnitState.Idle;
        this._hp = this._maxHP;
        this._cooldown = 0;
        this._isAnimationEnded = false;
    };
    
    this.update = function(dt)
    {        
        if (this._state != UnitState.Dying && this._hp <= 0)
        {
            var self = this;
            this._isAnimationEnded = false;
            this._spriteView.startAnimation("dying", {
                callback: function() {
                    self._isAnimationEnded = true;
                    self._spriteView.stopAnimation();
                },
                iterations: 1,
                delay: 30000,
            });
            this._state = UnitState.Dying;
        }
        
        switch (this._state)
        {
            case UnitState.Idle:
                return this.updateIdle(dt);
                
            case UnitState.March:
                return this.updateMarch(dt);
                
            case UnitState.Attack:
                return this.updateAttack(dt);
                
            case UnitState.Dying:
                return this.updateDying(dt);
        }        
        
        return true;
    };
    
    this.updateIdle = function(dt)
    {   
        this._cooldown -= dt;
        if (this._cooldown <= 0)
        {        
            if (!this.attackEnemyInRange())
            {
                this._spriteView.startAnimation("walk", {loop: true});
                this._state = UnitState.March;
            }
        }
        return true;
    }
    
    this.updateAttack = function(dt)
    {   
        if (this._isAnimationEnded)
        {
            this._spriteView.startAnimation("idle", {loop: true});
            this._state = UnitState.Idle;
            
            this._cooldown = this._attackCooldown;
        }
        
        return true;
    }
    
    this.updateDying = function(dt)
    {   
        return !this._isAnimationEnded;
    }
    
    this.attackEnemyInRange = function()
    {
        var enemyInRange = this._parent.findEnemyInRangeOf(this);
        
        if (enemyInRange)
        {
            var self = this;
            this._isAnimationEnded = false;
            this._spriteView.startAnimation("attack", {
                callback: function() {
                    self._isAnimationEnded = true;
                },
                delay: Infinity,
            });
            
            this._parent.createProjectile('blood', this, enemyInRange);
            this._state = UnitState.Attack;
            
            return true;
        }
        
        return false;
    }
    
    this.updateMarch = function(dt)
    {
        if (!this.attackEnemyInRange())
        {
            var dir = this._owner._marchDirection;
            this.style.x += dir * dt * 0.01 * this._moveSpeed;
            if (this.style.x * dir >= this._owner._marchDestination * dir)
            {
                this._owner._opponent._hp -= this._attack;                                    
                return false;
            }
        }
        
        return true;
    }
    
    this.canAttack = function(other)
    {
        var dx = Math.abs(this.style.x - other.style.x);
        return dx < this._attackRange;
    }
});
