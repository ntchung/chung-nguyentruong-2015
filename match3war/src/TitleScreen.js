import ui.View;
import ui.TextView as TextView;
import ui.ImageScaleView;
import ui.ImageView;
import ui.resource.loader as loader;

exports = Class(ui.ImageScaleView, function(supr) {
    
    this.init = function(opts)
    {
        opts = merge(opts, {
            scaleMethod: 'cover',
            x: 0,
            y: 0,
            image: "resources/images/title_screen.jpg"
        });
        
        supr(this, 'init', [opts]);        
        
        var view = this;
        loader.preload(['resources/images'], function() {
           initAfterPreload(view); 
        });        
    };       
    
    
    function initAfterPreload(view)
    {
        var screenWidth = GLOBAL.viewWidth;
        var screenHeight = GLOBAL.viewHeight;
        
        var startButton = new ui.ImageView({
            superview: view,
            x: 120,
            y: (screenHeight - 120),
            width: 240,
            height: 80,
            image: "resources/images/ui/green_button00.png"
        });

        var textview = new TextView({
            superview: startButton,
            text: "Start game",
            color: "white",
            size: 40,
            x: 0,
            y: 0,
            width: startButton.style.width,
            height: startButton.style.height
        });

        startButton.on('InputStart', bind(view, function () {
            startButton.setImage("resources/images/ui/green_button01.png");
            startButton.style.height = 76;
            startButton.style.y = (screenHeight - 120) + 4;
            this.emit('titlescreen:start');
        }));

        startButton.on('InputOut', bind(view, function () {
            startButton.setImage("resources/images/ui/green_button00.png");
            startButton.style.height = 80;
            startButton.style.y = (screenHeight - 120);
        }));
    }

});
