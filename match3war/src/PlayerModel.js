import src.common.constants as constants;

exports = Class(function() {
    
    this.init = function()
    {
        this._gemsCollected = [];        
        for (var i = 0; i < constants.GEM_TYPE_COUNT; ++i)
        {
            this._gemsCollected.push(0);
        }
        
        this._coins = 0;
        this._mana = 0;
        this._hp = 0;
        this._positionX = 0;
        this._marchDirection = 0;
        this._marchDestination = 0;        
    }
    
    this.reset = function()
    {
        for (var i = 0; i < constants.GEM_TYPE_COUNT; ++i)
        {
            this._gemsCollected[i] = 0;
        }
        this._coins = 0;
        this._mana = 0;
        this._hp = constants.PLAYER_MAX_HP;
    }
    
    this.getHPPercent = function()
    {
        return this._hp / constants.PLAYER_MAX_HP;
    }
    
    this.collectGems = function(type, count)
    {
        this._gemsCollected[type] += count;
        this._coins += count;
    }
    
    this.useGem = function(type, count)
    {
        this._gemsCollected[type] -= count;
        this._coins += count;
    }
    
    this.addMana = function(count)
    {
        this._mana += count;
    }
    
    this.useMana = function(count)
    {
        this._mana -= count;
    }
});
