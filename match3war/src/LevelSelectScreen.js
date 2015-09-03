import ui.View;
import ui.ImageScaleView;
import ui.widget.ButtonView as ButtonView;

exports = Class(ui.ImageScaleView, function(supr) {
    
    this.init = function(opts)
    {
        var screenWidth = GLOBAL.viewWidth;
        var screenHeight = GLOBAL.viewHeight;
        
        opts = merge(opts, {
            scaleMethod: 'cover',
            x: 0,
            y: 0,
            image: "resources/images/title_screen.jpg"
        });
        
        supr(this, 'init', [opts]);        
        
        var view = this;
        
        // Show buttons
        var startButton = new ButtonView({
            superview: view,
            x: 120,
            y: (screenHeight - 120),
            width: 240,
            height: 80,
            images: {
                up: "resources/images/ui/green_button00.png",
                down: "resources/images/ui/green_button01.png"
            },
            text: {
					color: "#FFFFFF",
					size: 30,
					autoFontSize: true,
					autoSize: false,
            },
            title: "Start game",
            on: {
                up: function() {
                    view.emit('levelselectscreen:go');
                }
            }
        });        
    };      
});