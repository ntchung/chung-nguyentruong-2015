import device;
import ui.StackView as StackView;
import ui.TextView as TextView;

import src.TitleScreen as TitleScreen;
import src.LevelSelectScreen as LevelSelectScreen;
import src.GameScreen as GameScreen;

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
      
      rootView.push(gameScreen);
      
      //rootView.push(titleScreen);      
      
      /*titleScreen.on('titlescreen:start', function () {          
          rootView.push(levelSelectScreen);
      });
      
      levelSelectScreen.on('levelselectscreen:go', function() {
          rootView.push(gameScreen);
      });*/
  };

  this.launchUI = function () {

  };

});
