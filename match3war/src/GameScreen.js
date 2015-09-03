import ui.View;
import ui.ImageView;

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
        
        var gemsBoard = new GemsBoard({
            superview: this,
            x: 12,
            y: 258,
        });
    };  
});