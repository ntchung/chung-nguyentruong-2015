import ui.View;
import ui.ImageScaleView as ImageScaleView;
import ui.ViewPool as ViewPool;
import ui.SpriteView as SpriteView;
import math.geom.Vec2D as Vec2D;

import src.battle.BattleUnit as BattleUnit;
import src.battle.BattleProjectileHit as BattleProjectileHit;
import src.common.constants as constants;

exports = Class(ui.View, function(supr) {
    
    this.init = function(opts)
    { 
        supr(this, 'init', [opts]);  
        
        this._isActive = false;
        this._model = opts.model;
        this._parent = opts.superview;
        this._isUIChanged = false;
      
        this._unitsList = [];
        this.loadUnits();
        
        this._projectilesList = [];
        this.loadProjectiles();
    };
    
    this.newGame = function(opts)
    {
        this._isActive = true;  
        
        this._enemySpawnUnitTimeOut = constants.SPAWN_INTERVAL;
        this._enemyAddCoinsTimeOut = constants.ENEMY_ADD_COINS_TIME;
        this._enemyAddCoinsRate = opts.enemyAddCoinsRate;
        
        this._playerSpawnUnitTimeOut = constants.SPAWN_INTERVAL;
        
        this._unitsList.length = 0;
        this._projectilesList.length = 0;
    };
    
    this.cleanUp = function()
    {
        this._isActive = false;
        this._unitsList.length = 0;
        this._projectilesList.length = 0;
        
        this._unitsPool['goblin'].releaseAllViews();
        this._unitsPool['pikeman'].releaseAllViews();
    };
    
    this.tick = function(dt)
    {
        if (!this._isActive)
        {
            return;
        }
        
        if (this._isUIChanged)
        {
            this._isUIChanged = false;
            this._parent.emit("battlefield:updatemodel");
        }
                    
        this.updatePlayer(dt);
        this.updateEnemy(dt);                
        this.updateUnits(dt);
        this.updateProjectiles(dt);
        this.checkPlayerStatus();    
    };
    
    this.updateProjectiles = function(dt)
    {
        var count = this._projectilesList.length;
        for (var i = count - 1; i >= 0; --i)
        {
            var projectile = this._projectilesList[i];
            if (!projectile.update(dt))
            {          
                projectile._pool.releaseView(projectile);              
                
                --count;
                this._projectilesList[i] = this._projectilesList[count];                
            }
        }        
        this._projectilesList.length = count;
    }
    
    this.updateUnits = function(dt)
    {
        var count = this._unitsList.length;
        for (var i = count - 1; i >= 0; --i)
        {
            var unit = this._unitsList[i];
            if (!unit.update(dt))
            {
                this.informUIChanged();            
                unit._pool.releaseView(unit);              
                
                --count;
                this._unitsList[i] = this._unitsList[count];                
            }
        }        
        this._unitsList.length = count;
    }
    
    this.updatePlayer = function(dt)
    {
        this._playerSpawnUnitTimeOut -= dt;
        if (this._playerSpawnUnitTimeOut <= 0)
        {
            this._playerSpawnUnitTimeOut += constants.SPAWN_INTERVAL;
            
            var desiredDice = Math.floor(Math.random() * 2);
            var desiredType = null;
            switch (desiredDice)
            {
                case 1:
                    desiredType = 'pikeman';                    
                    break;
                default:
                    desiredType = 'pikeman'
                    break;
            }            
            
            if (desiredType)
            {
                var cost = this._unitsCost[desiredType];
                if (this._model._human._coins >= cost)
                {
                    this._model._human._coins -= cost;
                    this.createBattleUnit(this._model._human, desiredType);
                    
                    this.informUIChanged();
                }
            }
        }
    }
    
    this.updateEnemy = function(dt)
    {
        this._enemyAddCoinsTimeOut -= dt;
        if (this._enemyAddCoinsTimeOut <= 0)
        {
            this._enemyAddCoinsTimeOut = constants.ENEMY_ADD_COINS_TIME;
            this._model._enemy._coins += this._enemyAddCoinsRate;
        }
        
        this._enemySpawnUnitTimeOut -= dt;
        if (this._enemySpawnUnitTimeOut <= 0)
        {
            this._enemySpawnUnitTimeOut += constants.SPAWN_INTERVAL;
            
            var desiredDice = Math.floor(Math.random() * 2);
            var desiredType = null;
            switch (desiredDice)
            {
                case 1:
                    desiredType = 'goblin';                    
                    break;
                default:
                    desiredType = 'goblin'
                    break;
            }            
            
            if (desiredType)
            {
                var cost = this._unitsCost[desiredType];
                if (this._model._enemy._coins >= cost)
                {
                    this._model._enemy._coins -= cost;
                    this.createBattleUnit(this._model._enemy, desiredType);
                }
            }
        }        
    }
    
    this.informUIChanged = function()
    {
        this._isUIChanged = true;
    };
    
    this.checkPlayerStatus = function() 
    {
        if (this._model._human._hp <= 0)
        {
            this._parent.cleanUp();
            this._parent.emit('gamescreen:result', false);
            this._isActive = false;
        }
        else if (this._model._enemy._hp <= 0)
        {
            this._parent.cleanUp();
            this._parent.emit('gamescreen:result', true);
            this._isActive = false;
        }
    };
    
    this.createBattleUnit = function(player, type)
    {
        var pool = this._unitsPool[type];
        var unit = pool.obtainView();
        unit.onObtain({
            player: player,
            pool: pool,
            y: Math.random() * this.style.height,
        });
        
        this._unitsList.push(unit);
    };    
    
    this.createProjectile = function(type, attacker, defender)
    {
        var pool = this._projectilesPool[type];
        var projectile = pool.obtainView();
        projectile.onObtain({
            attacker: attacker,
            defender: defender,
            pool: pool,
        });
        
        this._projectilesList.push(projectile);
    }
    
    this.findEnemyInRangeOf = function(fromUnit)
    {
        var count = this._unitsList.length;
        for (var i = count - 1; i >= 0; --i)
        {
            var unit = this._unitsList[i];
            if (unit._owner != fromUnit._owner &&
                fromUnit.canAttack(unit))
            {
                return unit;
            }
        }
        
        return null;
    }
    
    this.loadProjectiles = function()
    {
        this._projectilesPool = {};
        var pool;
        
        pool = new ViewPool({
            ctor: BattleProjectileHit,
            initCount: 100,
            initOpts: {
                superview: this,
                url: "resources/images/projectiles/blood",                
                delay: 400,
            }
        });
        this._projectilesPool['blood'] = pool;
    }
    
    this.loadUnits = function()
    {                
        this._unitsPool = {};       
        this._unitsCost = {};
        var pool;
        
        pool = new ViewPool({
            ctor: BattleUnit,
            initCount: 50,
            initOpts: {
                superview: this, 
                url: "resources/images/units/goblin",
                maxHP: 8,
                moveSpeed: 6,
                attack: 4,
                attackRange: 50,
                attackCooldown: 100,
            }
        }); 
        this._unitsPool['goblin'] = pool;
        this._unitsCost['goblin'] = 5;
        
        pool = new ViewPool({
            ctor: BattleUnit,
            initCount: 50,
            initOpts: {
                superview: this, 
                url: "resources/images/units/pikeman",
                maxHP: 10,
                moveSpeed: 4,
                attack: 4,
                attackRange: 55,
                attackCooldown: 100,
            }
        }); 
        this._unitsPool['pikeman'] = pool;        
        this._unitsCost['pikeman'] = 7;
    }
});
