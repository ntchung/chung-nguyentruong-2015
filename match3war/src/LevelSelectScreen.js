import ui.View;
import ui.ImageScaleView;

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
    };      
});