import device;
import ui.StackView as StackView;
import ui.TextView as TextView;

import src.TitleScreen as TitleScreen;

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
          scale: scaleRatio
      });

      GLOBAL.viewWidth = rootView.style.width;
      GLOBAL.viewHeight = rootView.style.height;
      
      var titleScreen = new TitleScreen();
      rootView.push(titleScreen);      
  };

  this.launchUI = function () {

  };

});
