import src.common.constants as constants;
import src.PlayerModel as PlayerModel;

exports = Class(function() {
    
    this.init = function()
    {
        this._human = new PlayerModel();
        this._human._positionX = -16;
        this._human._marchDirection = 1;        
        
        this._enemy = new PlayerModel();
        this._enemy._positionX = 480 + 16;
        this._enemy._marchDirection = -1;
        
        this._human._opponent = this._enemy;
        this._human._marchDestination = this._enemy._positionX;
        
        this._enemy._opponent = this._human;
        this._enemy._marchDestination = this._human._positionX;
    }
    
});
