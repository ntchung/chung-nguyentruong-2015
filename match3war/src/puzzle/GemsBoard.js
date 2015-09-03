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
        
        this._rows = opts.rows;
        this._cols = opts.cols;
        this._gems = new Array(opts.rows);                
        for (var row = 0; row < opts.rows; ++row)
        {
            this._gems[row] = new Array(opts.cols);
            for (var col = 0; col < opts.cols; ++col)
            {
                var rndType = Math.floor(Math.min(Math.random() * 5, 4)) + 1;
                var gem = new Gem({
                    superview: this,
                    row: row,
                    col: col,
                    type: rndType,
                });
                                
                this._gems[row][col] = gem;
            }
        }    
        
        this._selectedGem = null;
        
        this.on('InputStart', function (event, point) {
            // Find pointed gem
            var row = Math.floor(point.y / GLOBAL.gemHeight);
            if (row >= 0 && row < this._rows)
            {
                var col = Math.floor(point.x / GLOBAL.gemWidth);
                if (col >= 0 && col < this._cols)
                {
                    this._selectedGem = this._gems[row][col];
                    this._selectedGem.animateSelection();
                }
            }
        });
        
        this.on('InputMove', function (event, point) {
            console.log("Moved: " + point.x + "," + point.y);
        });
        
        this.on('InputOut', function (event, point) {
            if (this._selectedGem)
            {
                this._selectedGem.animateUnselection();
            }
            this._selectedGem = null;
        });
    };     
    
    this.render = function(ctx) {
        // Let it empty.
    }
});
