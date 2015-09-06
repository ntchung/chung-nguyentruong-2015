import ui.View;
import ui.ImageScaleView as ImageScaleView;
import ui.ImageView as ImageView;
import ui.GestureView as GestureView;
import ui.widget.ButtonView as ButtonView;
import animate;

exports = Class(ImageScaleView, function(supr) {
    
    this.init = function(opts)
    {
        opts = merge(opts, {
            scaleMethod: 'cover',
            x: 0,
            y: 0,
            image: "resources/images/victory.jpg",            
        });
        
        supr(this, 'init', [opts]);       
        
        var screenWidth = GLOBAL.viewWidth;
        var screenHeight = GLOBAL.viewHeight;
        
        var view = this;
        
        // Show buttons
        var startButton = new ButtonView({
            superview: this,
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
                shadowColor: "#111111",
            },
            title: "Back",
            on: {
                up: function() {                    
                    view.emit('resultscreen:back');
                }
            }
        });
        
        this.on('app:setresult', function(isWinning) {
            view.setImage(isWinning
                ? "resources/images/victory.jpg"
                : "resources/images/defeat.jpg"
            );
        });
    }
    
});
