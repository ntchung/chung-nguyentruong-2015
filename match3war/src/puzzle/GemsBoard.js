import ui.View;
import ui.GestureView as GestureView;

import src.puzzle.Gem as Gem; 
import src.common.constants as constants;

exports = Class(ui.View, function(supr) {
    this.init = function(opts)
    { 
        opts = merge(opts, {            
            width: 455,
            height: 455,            
            rows: 10,
            cols: 10,
        });
        
        supr(this, 'init', [opts]);                
        
        GLOBAL.gemWidth = constants.BOARD_WIDTH / opts.rows;
        GLOBAL.gemHeight = constants.BOARD_HEIGHT / opts.cols;
        
        this._gems = [];        
        for (var row = 0; row < opts.rows; ++row)
        {
            for (var col = 0; col < opts.cols; ++col)
            {
                var rndType = Math.floor(Math.min(Math.random() * 5, 4)) + 1;
                var gem = new Gem({
                    superview: this,
                    row: row,
                    col: col,
                    type: rndType,
                });
                                
                this._gems.push(gem);
            }
        }     
        
        var gview = new GestureView({
			superview: this,
			x: 0,
            y: 0,
            width: constants.BOARD_WIDTH,
            height: constants.BOARD_HEIGHT,
			backgroundColor: 'blue', 
            opacity: 0,
		});
        
        gview.on('Swipe', bind(this, 'swipe'));
		gview.on('Pinch', bind(this, 'pinch'));
		gview.on('Rotate', bind(this, 'rotate'));
		gview.on('DragSingle', bind(this, 'drag'));
		gview.on('FingerDown', bind(this, 'fingerDown'));
		gview.on('FingerUp', bind(this, 'fingerUp'));
		gview.on('ClearMulti', bind(this, 'clearMulti'));
    };  
    
    this.swipe = function (angle, dir, numberOfFingers) {
		console.log(angle + " " + dir + " " + numberOfFingers);
	};

	this.pinch = function (d) {
		console.log("Pinch");
	};

	this.rotate = function (r) {
		console.log("rotate");
	};

	this.drag = function(dx, dy) {
		console.log("Drag");
	};

	this.fingerDown = function(fingerCount) {
		console.log('FingerDown. New count: ' + fingerCount);
	};

	this.fingerUp = function(fingerCount) {
		console.log('FingerUp. New count: ' + fingerCount);
	};

	this.clearMulti = function() {
		console.log("Clear");
	};
    
    this.render = function(ctx) {
        // Let it empty.
    }
});
