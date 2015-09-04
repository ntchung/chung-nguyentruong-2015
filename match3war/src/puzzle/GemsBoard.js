import ui.View;
import ui.ViewPool as ViewPool;
import math.geom.Vec2D as Vec2D;

import src.puzzle.Gem as Gem; 
import src.common.constants as constants;

BoardState = {
    Idle: 0,
    Collapse: 1,
    Explode: 2,
};

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
        
        this._interractionLock = 500;
        this._intentSwapFromGem = null;
        this._intentSwapToGem = null;
        
        this._checkForMatchesTargets = null;
        this._state = BoardState.Explode;
        
        this._gemsPool = new ViewPool({
            ctor: Gem,
            initCount: opts.rows * opts.cols,
            initOpts: {
                superview: this,
                width: GLOBAL.gemWidth,
                height: GLOBAL.gemHeight,
                type: 1
            }
        });
        
        this._rows = opts.rows;
        this._cols = opts.cols;
        this._gems = new Array(opts.rows);                
        for (var row = 0; row < opts.rows; ++row)
        {
            this._gems[row] = new Array(opts.cols);
            for (var col = 0; col < opts.cols; ++col)
            {
                this.fillGemAt(row, col);
            }
        }    
                
        this._selectedGem = null;
        this._touchBeginPoint = null;
        
        this.on('InputStart', function (event, point) {
            // Find pointed gem
            var row = Math.floor(point.y / GLOBAL.gemHeight);
            var col = Math.floor(point.x / GLOBAL.gemWidth);
            this._selectedGem = this.getGemAt(row, col);            
            if (this._selectedGem)
            {                
                this._selectedGem.animateSelection();
                this._touchBeginPoint = point;
            }
        });
        
        this.on('InputMove', function (event, point) {
            if (this._touchBeginPoint && this._selectedGem)
            {
                var delta = new Vec2D({
                    x: point.x - this._touchBeginPoint.x,
                    y: point.y - this._touchBeginPoint.y
                });
                
                var mag = delta.getMagnitude();
                if (mag > constants.TOUCH_MOVE_THRESHOLD_FOR_SWAP_GEM)
                {
                    var fromRow = this._selectedGem._row;
                    var fromCol = this._selectedGem._col;
                    
                    if (Math.abs(delta.y) > Math.abs(delta.x))
                    {
                        var dy = delta.y < 0 ? -1 : 1;
                        var toGem = this.getGemAt(fromRow + dy, fromCol);
                        
                        this._intentSwapFromGem = this._selectedGem;
                        this._intentSwapToGem = toGem;                        
                    }
                    else                        
                    {
                        var dx = delta.x < 0 ? -1 : 1;
                        var toGem = this.getGemAt(fromRow, fromCol + dx);
                        
                        this._intentSwapFromGem = this._selectedGem;
                        this._intentSwapToGem = toGem;
                    }                    
                }
            }
        });
        
        this.on('InputOut', function (event, point) {
            this.unselectCurrentGem();
        });
    };     
    
    this.unselectCurrentGem = function() {
        if (this._selectedGem)
        {
            this._selectedGem.animateUnselection();
        }
        this._selectedGem = null;
        this._touchBeginPoint = null;
    }
    
    // Override the render and let the board has empty background
    this.render = function(ctx) {
    };   
    
    this.swapGems = function(fromGem, toGem)
    {
        // Wrong move
        if (fromGem == null || toGem == null)
        {
            return;
        }
        
        // The swap is pointless?
        if (!this.checkSwap(fromGem, toGem))
        {
            fromGem.feintSwap(toGem);
            toGem.feintSwap(fromGem);
        }
        // Swap succeeds
        else
        {
            this._gems[fromGem._row][fromGem._col] = toGem;
            this._gems[toGem._row][toGem._col] = fromGem;
            
            fromGem.swap(toGem);            
        }
        
        this._interractionLock = 300;
        this.unselectCurrentGem();
    };
    
    this.checkSwap = function(fromGem, toGem)
    {
        // Note - this function is not thread-safe
        var row = toGem._row;
        var col = toGem._col;
        var res = false;
        
        // temporary swap
        this._gems[fromGem._row][fromGem._col] = toGem;
        
        // Vertical check
        var verticleCount = 1;
        for (var i = row + 1; i < this._rows; ++i)
        {
            var gem = this.getGemAt(i, col);
                      
            if (fromGem.isMatched(gem))
            {
                ++verticleCount;                
            }
            else
            {
                break;
            }
        }
        for (var i = row - 1; i >= 0; --i)
        {
            var gem = this.getGemAt(i, col);
            
            if (fromGem.isMatched(gem))
            {
                ++verticleCount;                
            }
            else
            {
                break;
            }
        }        
        if (verticleCount >= constants.LEAST_MATCHES_REQUIRED)
        {
            res = true;
        }
        
        // Horizontal check
        var horizontalCount = 1;
        for (var i = col + 1; i < this._cols; ++i)
        {
            var gem = this.getGemAt(row, i);
            
            if (fromGem.isMatched(gem))
            {
                ++horizontalCount;
            }
            else
            {
                break;                
            }
        }
        for (var i = col - 1; i >= 0; --i)
        {
            var gem = this.getGemAt(row, i);
            
            if (fromGem.isMatched(gem))
            {
                ++horizontalCount;
            }
            else
            {
                break;                
            }
        }        
        if (horizontalCount >= constants.LEAST_MATCHES_REQUIRED)
        {
            res = true;
        }
        
         // undo the swap
        this._gems[fromGem._row][fromGem._col] = fromGem;
        return res;
    }
        
    this.getGemAt = function(row, col)
    {
        if (row >= 0 && row < this._rows)
        {
            if (col >= 0 && col < this._cols)
            {
                return this._gems[row][col];
            }
        }
        
        return null;
    };
    
    this.tick = function(dt)
    {
        if (this._interractionLock > 0)
        {
            this._interractionLock -= dt;
        }
        else
        {
            if (this._state == BoardState.Collapse)
            {
                var checkCount = 0;
                for (var row = this._rows - 1; row >= 0; --row)
                {
                    for (var col = 0; col < this._cols; ++col)
                    {
                        var gem = this._gems[row][col];
                        checkCount += this.collapseGem(gem);
                    }
                }
                
                for (var row = 0; row < this._rows; ++row)
                {
                    for (var col = 0; col < this._cols; ++col)
                    {
                        checkCount += this.fillGemAt(row, col);
                    }
                }
                
                if (checkCount > 0)
                {                       
                    this._checkForMatchesTargets = null;
                    this._state = BoardState.Explode;     
                    
                    this._interractionLock = 300;
                }                
                else
                {
                    this._state = BoardState.Idle;     
                }
            }
            else if (this._state == BoardState.Explode)
            {
                var checkCount = 0;
                
                if (this._checkForMatchesTargets)
                {
                    var view = this;
                    this._checkForMatchesTargets.forEach(function(element, index, array) {
                        checkCount += view.explodeMatches(element); 
                    });
                }
                else
                {
                    for (var row = 0; row < this._rows; ++row)
                    {
                        for (var col = 0; col < this._cols; ++col)
                        {
                            var gem = this._gems[row][col];
                            checkCount += this.explodeMatches(gem);                        
                        }
                    }
                }
                
                this._checkForMatchesTargets = null;
                
                if (checkCount > 0)
                {
                    this._state = BoardState.Collapse;
                }
                else
                {                    
                    this._state = BoardState.Idle;                         
                }
                
                this._interractionLock = 100;
            }            
            
            var swapFromGem = this._intentSwapFromGem;
            var swapToGem = this._intentSwapToGem;
            this._intentSwapFromGem = null;
            this._intentSwapToGem = null;                
            
            if (swapFromGem && swapToGem)
            {
                this.swapGems(swapFromGem, swapToGem);                
                
                this._checkForMatchesTargets = [swapFromGem, swapToGem];
                this._state = BoardState.Explode;                
            }
        }
    }
    
    this.removeGemAt = function(row, col)
    {
        var gem = this.getGemAt(row, col);
        if (gem)
        {
            this._gems[row][col] = null;
            this._gemsPool.releaseView(gem);
        }
    }
    
    this.removeGem = function(gem)
    {
        if (gem)
        {
            this._gems[gem._row][gem._col] = null;
            this._gemsPool.releaseView(gem);
        }
    }
    
    this.fillGemAt = function(row, col)
    {
        if (this._gems[row][col] == null)
        {
            var rndType = Math.floor(Math.min(Math.random() * 5, 4)) + 1;
            var gem = this._gemsPool.obtainView();
            gem.onObtain({
                row: row,
                col: col,
                type: rndType,
            });            

            this._gems[row][col] = gem;
            
            return 1;
        }
        
        return 0;
    }
    
    this.collapseGem = function(gem)
    {
        if (gem)
        {
            var row = gem._row;
            var col = gem._col;
            
            var fallToRow = null;
            for (var i = row + 1; i < this._rows; ++i)
            {
                var g = this.getGemAt(i, col);
                if (!g)
                {
                    fallToRow = i;
                }
                else
                {
                    break;
                }
            }
            
            if (fallToRow)
            {
                gem._row = fallToRow;
                gem.gravityFall();
                
                this._gems[row][col] = null;
                this._gems[fallToRow][col] = gem;
                
                return 1;
            }
        }
        
        return 0;
    }
    
    this.explodeMatches = function(fromGem)
    {
        if (fromGem)
        {
            var exploded = false;
            var row = fromGem._row;
            var col = fromGem._col;

            // Vertical check
            var verticalMatches = [];
            for (var i = row + 1; i < this._rows; ++i)
            {
                var gem = this.getGemAt(i, col);
                if (!fromGem.isMatched(gem))
                {
                    break;
                }
                else
                {
                    verticalMatches.push(gem);
                }
            }
            for (var i = row - 1; i >= 0; --i)
            {
                var gem = this.getGemAt(i, col);
                if (!fromGem.isMatched(gem))
                {
                    break;
                }
                else
                {
                    verticalMatches.push(gem);
                }
            }        
            if (verticalMatches.length >= constants.LEAST_MATCHES_REQUIRED - 1)
            {
                var view = this;
                verticalMatches.forEach(function(element, index, array) {
                    view.removeGem(element);
                });
                
                exploded = true;
            }

            // Horizontal check
            var horizontalMatches = [];
            for (var i = col + 1; i < this._cols; ++i)
            {
                var gem = this.getGemAt(row, i);
                if (!fromGem.isMatched(gem))
                {
                    break;
                }
                else
                {
                    horizontalMatches.push(gem);
                }
            }
            for (var i = col - 1; i >= 0; --i)
            {
                var gem = this.getGemAt(row, i);
                if (!fromGem.isMatched(gem))
                {
                    break;
                }
                else
                {
                    horizontalMatches.push(gem);
                }
            }        
            if (horizontalMatches.length >= constants.LEAST_MATCHES_REQUIRED - 1)
            {
                var view = this;
                horizontalMatches.forEach(function(element, index, array) {
                    view.removeGem(element);
                });
                
                exploded = true;
            }

            if (exploded)
            {
                this.removeGem(fromGem);
                return verticalMatches.length + horizontalMatches.length;
            }
        }
        
        return 0;
    }
});
