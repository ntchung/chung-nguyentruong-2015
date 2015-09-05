import src.common.constants as constants;
import src.PlayerModel as PlayerModel;

exports = Class(function() {
    
    this.init = function()
    {
        this._human = new PlayerModel();
        this._enemy = new PlayerModel();
    }
    
});
