import ui.View;
import ui.ImageView;

import ui.widget.ButtonView as ButtonView;
import src.puzzle.GemsBoard as GemsBoard;

exports = Class(ui.View, function(supr) {
    
    this.init = function(opts)
    {
        var screenWidth = GLOBAL.viewWidth;
        var screenHeight = GLOBAL.viewHeight;
        
        supr(this, 'init', [opts]);      
        
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
        });
        
        var view = this;
        
        // Show buttons
        var exitButton = new ButtonView({
            superview: this,
            x: 10,
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
        
        this.on('app:newgame', function() {
            this.newGame();
        });
    };
    
    this.newGame = function()
    {
        this._gemsBoard.newGame(10, 10);
    }
    
    this.clearGemsBoard = function()
    {
        this._gemsBoard.cleanUp();        
    }
});