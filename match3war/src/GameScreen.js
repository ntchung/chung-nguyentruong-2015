import ui.View;
import ui.ImageView;

import ui.widget.ButtonView as ButtonView;
import ui.ScoreView as ScoreView;
import src.puzzle.GemsBoard as GemsBoard;
import src.GameModel as GameModel;

var getCounterCharacterData = function()
{
    var d = {};
	for (var i = 0; i < 10; i++) {
		d[i] = {
			image: "resources/images/numbers/" + "coin_" + i + ".png"
		};
	}
    d["x"] = {
        image: "resources/images/numbers/" + "coin_x.png"
    };
	return d;
}

exports = Class(ui.View, function(supr) {
    
    this.init = function(opts)
    {
        var screenWidth = GLOBAL.viewWidth;
        var screenHeight = GLOBAL.viewHeight;
        
        supr(this, 'init', [opts]);      
        
        this._model = new GameModel();
        
        var background = new ui.ImageView({
            superview: this,
            x: 0,
            y: 0,
            width: 480,
            height: 960,
            image: "resources/images/bkgd_table.png"
        });                
        
        this._gemsBoard = new GemsBoard({
            superview: this,
            x: 12,
            y: 258,
            player: this._model._human,
        });
        
        var view = this;
        
        // Show buttons
        var exitButton = new ButtonView({
            superview: this,
            x: screenWidth - 90,
            y: 10,
            width: 80,
            height: 80,
            images: {
                up: "resources/images/ui/button_pause.png",
                down: "resources/images/ui/button_pause_pressed.png"
            },
            on: {
                up: function() {
                    view.clearGemsBoard();
                    view.emit('gamescreen:mainmenu');                    
                }
            }
        });
        
        this._labelManaCount = new ScoreView({
            superview: this,
            x: 10,
            y: 10,
            width: 500,
            height: 20,
            horizontalAlign: "left",
            characterData: getCounterCharacterData(),            
            text: "32322x35235",
            
        });
        
        this.on('app:newgame', function() {
            this.newGame();
        });
    };
    
    this.tick = function(dt)
    {
        //this._labelManaCount.setText("2352353253");
    }
    
    this.newGame = function()
    {
        this._model._human.reset();
        this._model._enemy.reset();
        
        this._gemsBoard.newGame(10, 10);
    }
    
    this.clearGemsBoard = function()
    {
        this._gemsBoard.cleanUp();        
    }
});

