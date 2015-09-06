import ui.View;
import ui.ImageView as ImageView;
import ui.GestureView as GestureView;
import ui.widget.ButtonView as ButtonView;
import animate;

exports = Class(ui.View, function(supr) {
    
    this.init = function(opts)
    {
        var screenWidth = GLOBAL.viewWidth;
        var screenHeight = GLOBAL.viewHeight;        
        
        supr(this, 'init', [opts]);                        
        var view = this;
        
        this._worldMapScale = screenHeight / 512.0;             
        
        this._worldMap = new ImageView({
            superview: this,
            x: 0,
            y: 0,
            autoSize: true,
            scale: this._worldMapScale,
            image: "resources/images/worldmaps/worldmap.png"
        });        
            
        var gview = new GestureView({
			superview: this._worldMap,
			layout: 'box',
			backgroundColor: 'blue',
            opacity: 0.0,
		});   
        
        gview.on('DragSingle', bind(this, 'drag'));
        gview.on('Swipe', bind(this, 'swipe'));
        
        // Show buttons
        this.createMapButton(25, 185, {rows: 5, cols: 5});
        this.createMapButton(150, 360, {rows: 6, cols: 6});
        this.createMapButton(280, 225, {rows: 7, cols: 7});
        this.createMapButton(420, 440, {rows: 8, cols: 8});
        this.createMapButton(460, 240, {rows: 9, cols: 9});
        this.createMapButton(690, 270, {rows: 10, cols: 10});
        this.createMapButton(920, 195, {rows: 11, cols: 11});
    };      
    
    this.createMapButton = function(x, y, opts)
    {
        var view = this;
        var button = new ButtonView({
            superview: this._worldMap,
            x: x,
            y: y,
            anchorX: 30,
            anchorY: 30,
            width: 60,
            height: 60,
            images: {
                up: "resources/images/ui/button_round_purple.png",
                down: "resources/images/ui/button_round_purplepressed.png"
            },
            text: {
                color: "#FFFFFF",
                size: 18,
                autoFontSize: true,
                autoSize: false,
                shadowColor: "#111111",
            },
            title: "Go!",
            on: {
                up: function() {
                    view.emit('levelselectscreen:go', opts);
                }
            }
        });  
        
        return button;
    }
    
    this.render = function(ctx)
    {        
    };
    
    this.drag = function(dx, dy) 
    {
        var maxX = this._worldMap.style.width * this._worldMapScale - GLOBAL.viewWidth;
        var targetX = Math.max(Math.min(this._worldMap.style.x + dx * 8, 0), -maxX);
        
        animate(this._worldMap).clear().now({x: targetX}, 100, animate.linear);
	};
    
    this.swipe = function (angle, dir, numberOfFingers) 
    {
        var maxX = this._worldMap.style.width * this._worldMapScale - GLOBAL.viewWidth;        
        var targetX = this._worldMap.style.x;
        
		if (dir == 'left')
        {
            targetX = Math.max(Math.min(this._worldMap.style.x - 384, 0), -maxX);                    
        }
        else if (dir == 'right')
        {
            targetX = Math.max(Math.min(this._worldMap.style.x + 384, 0), -maxX);                    
        }
        
        animate(this._worldMap).clear().now({x: targetX}, 200, animate.easeOut);
	};
});
