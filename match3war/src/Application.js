import device;
import ui.StackView as StackView;
import ui.TextView as TextView;

import src.TitleScreen as TitleScreen;
import src.LevelSelectScreen as LevelSelectScreen;
import src.GameScreen as GameScreen;
import src.ResultScreen as ResultScreen;

exports = Class(GC.Application, function () {

  this.initUI = function () {

      this.view.style.background = '#000000';
      
      // iPhone 4 screen as base
      var scaleRatio = device.width / 480;      
      var rootView = new StackView({
          superview: this,
          x: 0,
          y: 0,
          width: 480,
          height: device.screen.height / scaleRatio,
          clip: true,
          scale: scaleRatio,
      });

      GLOBAL.viewWidth = rootView.style.width;
      GLOBAL.viewHeight = rootView.style.height;
      
      var levelSelectScreen = new LevelSelectScreen();
      var titleScreen = new TitleScreen();      
      var gameScreen = new GameScreen();      
      var resultScreen = new ResultScreen();
      
      //rootView.push(titleScreen);      
      rootView.push(gameScreen);    
      gameScreen.emit('app:newgame', {rows: 10, cols: 10});
      
      titleScreen.on('titlescreen:start', function () {                  
          rootView.push(levelSelectScreen);
      });
      
      levelSelectScreen.on('levelselectscreen:go', function(opts) {
          rootView.push(gameScreen);
          gameScreen.emit('app:newgame', opts);
      });
      
      gameScreen.on('gamescreen:mainmenu', function() {
          rootView.pop();
          
          if (!rootView.getCurrentView())
          {
              rootView.push(levelSelectScreen);
          }
      });
      
      gameScreen.on('gamescreen:result', function(isWinning) {
          rootView.pop({animate: false});
          if (!rootView.getCurrentView())
          {
              rootView.push(levelSelectScreen);
          }
          
          rootView.push(resultScreen);
          resultScreen.emit('app:setresult', isWinning);
      });
      
      resultScreen.on('resultscreen:back', function() {
          rootView.pop();
      });
  };

  this.launchUI = function () {

  };

});
