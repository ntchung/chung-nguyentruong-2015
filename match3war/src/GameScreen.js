import ui.View;
import animate;
import ui.ImageView as ImageView;
import ui.ImageScaleView as ImageScaleView;

import ui.SpriteView as SpriteView;
import ui.widget.ButtonView as ButtonView;
import ui.ScoreView as ScoreView;
import src.puzzle.GemsBoard as GemsBoard;
import src.GameModel as GameModel;
import src.battle.BattleField as BattleField;

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
        
        var background = new ImageView({
            superview: this,
            x: 0,
            y: 0,
            width: 480,
            height: 960,
            image: "resources/images/bkgd_table.png"
        });                
        
        this._battleField = new BattleField({
            superview: this,
            x: 0,
            y: 230,
            width: 480,
            height: 18,
            model: this._model,
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
                    view.cleanUp();
                    view.emit('gamescreen:mainmenu');                    
                }
            }
        });
        
        var scoreBoard = new ImageScaleView({
            superview: this,
            x: 10,
            y: 10,
            width: 250,
            height: 55,
            image: "resources/images/ui/coinframe.png",
            scaleMethod: "9slice",
            sourceSlices: {
                horizontal: {left: 40, center: 120, right: 40},
                vertical: {top: 24, middle: 64, bottom: 24}
            },
            
            destSlices: {
                horizontal: {left: 20, right: 20},
                vertical: {top: 12, bottom: 12}
            },
        });
        
        var iconMana = new ImageView({
            superview: scoreBoard,
            x: 15,
            y: 12,
            width: 30,
            height: 30,
            image: "resources/images/ui/bubble_icon_0001.png",            
        });
        
        this._labelManaCount = new ScoreView({
            superview: scoreBoard,
            x: 45,
            y: 18,
            width: 100,
            height: 20,
            horizontalAlign: "left",
            characterData: getCounterCharacterData(),            
            text: "x0",
            
        });
        
        var iconCoin = new ImageView({
            superview: scoreBoard,
            x: 120,
            y: 12,
            width: 30,
            height: 30,
            image: "resources/images/ui/icon_coin.png",
        });
        
        this._labelCoinsCount = new ScoreView({
            superview: scoreBoard,
            x: 145,
            y: 18,
            width: 100,
            height: 20,
            horizontalAlign: "left",
            characterData: getCounterCharacterData(),            
            text: "x0",            
        });
        
        var humanHPBarBack = new ImageScaleView({
            superview: this,
            x: 20,
            y: 90,
            width: 100,
            height: 20,
            image: "resources/images/ui/timer_small_empty.png",
            scaleMethod: "6slice",
            sourceSlices: {
                horizontal: {left: 24, center: 452, right: 24},
                vertical: {top: 21, bottom: 21}
            },
            
            destSlices: {
                horizontal: {left: 12, right: 12},
                vertical: {top: 12, bottom: 12}
            },
        });        
        
        this._humanHPBar = new ui.View({
            superview: this,
            x: 20,
            y: 90,
            width: 100,
            height: 20,
            clip: true,
        });
        
        var humanHPBarContent = new ImageScaleView({
            superview: this._humanHPBar,            
            x: 0,
            y: 0,
            width: 100,
            height: 20,
            image: "resources/images/ui/timer_small_full.png",
            scaleMethod: "6slice",
            sourceSlices: {
                horizontal: {left: 24, center: 452, right: 24},
                vertical: {top: 21, bottom: 21}
            },
            
            destSlices: {
                horizontal: {left: 12, right: 12},
                vertical: {top: 12, bottom: 12}
            },
        });
        
        var enemyHPBarBack = new ImageScaleView({
            superview: this,
            x: screenWidth - 100 - 20,
            y: 90,
            width: 100,
            height: 20,
            image: "resources/images/ui/timer_small_empty.png",
            
            scaleMethod: "6slice",
            sourceSlices: {
                horizontal: {left: 24, center: 452, right: 24},
                vertical: {top: 21, bottom: 21}
            },
            
            destSlices: {
                horizontal: {left: 12, right: 12},
                vertical: {top: 12, bottom: 12}
            },
        });        
        
        this._enemyHPBar = new ui.View({
            superview: this,
            x: screenWidth - 20,
            y: 90,
            scaleX: -1.0,
            width: 100,
            height: 20,
            clip: true,
        });
        
        var enemyHPBarContent = new ImageScaleView({
            superview: this._enemyHPBar,            
            x: 0,
            y: 0,
            width: 100,
            height: 20,
            image: "resources/images/ui/timer_small_full.png",
            scaleMethod: "6slice",
            sourceSlices: {
                horizontal: {left: 24, center: 452, right: 24},
                vertical: {top: 21, bottom: 21}
            },
            
            destSlices: {
                horizontal: {left: 12, right: 12},
                vertical: {top: 12, bottom: 12}
            },
        });
        
        this.on('app:newgame', function(opts) {
            this.newGame(opts);
        });
        
        this.on('gemsboard:updatemodel', function() {
            this._labelManaCount.setText("x" + this._model._human._mana);
            this._labelCoinsCount.setText("x" + this._model._human._coins);      
        });
        
        this.on('battlefield:updatemodel', function() {
            animate(this._humanHPBar).clear()
                .now({width: this._model._human.getHPPercent() * 100}, 300, animate.linear);
            
            this._enemyHPBar.style.width = this._model._enemy.getHPPercent() * 100;
        });
    };    
    
    this.newGame = function(opts)
    {
        this._model._human.reset();
        this._model._enemy.reset();
        
        this._gemsBoard.newGame(opts);        
        this._battleField.newGame(opts);
        
        this.emit('gemsboard:updatemodel');
        this.emit('battlefield:updatemodel');
    }
    
    this.cleanUp = function()
    {
        this._gemsBoard.cleanUp();        
        this._battleField.cleanUp();
    }
});

