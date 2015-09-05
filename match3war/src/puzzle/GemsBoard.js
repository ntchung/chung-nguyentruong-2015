import ui.View;
import ui.ViewPool as ViewPool;
import math.geom.Vec2D as Vec2D;

import src.puzzle.Gem as Gem; 
import src.puzzle.GemsBoardEffects as GemsBoardEffects;
import src.common.constants as constants;

BoardState = {
    Idle: 0,
    Collapse: 1,
    Explode: 2,
    Shuffle: 3,
};

exports = Class(ui.View, function(supr) {
    this.init = function(opts)
    { 
        opts = merge(opts, {            
            width: 455,
            height: 455,                        
        });        
                
        supr(this, 'init', [opts]);  
        
        this._player = opts.player;
                
        // Gems        
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
        
        // Effects
        this._effects = new GemsBoardEffects(this);        
             
        // Inputs handling                
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
    
    this.newGame = function(rows, cols)
    {
        GLOBAL.gemWidth = constants.BOARD_WIDTH / rows;
        GLOBAL.gemHeight = constants.BOARD_HEIGHT / cols;        
        
        this._rows = rows;
        this._cols = cols;
        this._gems = new Array(rows);                
        for (var row = 0; row < rows; ++row)
        {
            this._gems[row] = new Array(cols);
            for (var col = 0; col < cols; ++col)
            {
                this.fallGemTo(row, col);
            }
        }    
        
        this.resetPotentialChecks();
        
        this._selectedGem = null;
        this._touchBeginPoint = null;
        
        this._interractionLock = 500;
        this._intentSwapFromGem = null;
        this._intentSwapToGem = null;
        
        this._checkForMatchesTargets = null;
        this._hintPotentialMatchTimeOut = constants.HINT_POTENTIAL_MATCH_TIME;
        this._state = BoardState.Explode;        
    }
    
    this.cleanUp = function()
    {
        this._gemsPool.releaseAllViews();
    }
    
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
        if (fromGem == null || toGem == null || fromGem == toGem)
        {
            return false;
        }
        
        // Test if these gems are really adjacent
        var drow = Math.abs(fromGem._row - toGem._row);
        var dcol = Math.abs(fromGem._col - toGem._col);
        if ((drow == 1 && dcol == 0) || (drow == 0 && dcol == 1))
        {    
            this.unselectCurrentGem();
            
            // The swap is pointless?
            if (!this.checkSwap(fromGem, toGem) && !this.checkSwap(toGem, fromGem))
            {
                fromGem.feintSwap(toGem);
                toGem.feintSwap(fromGem);
                
                this._interractionLock = 300;
            }
            // Swap succeeds
            else
            {                  
                var fromRow = fromGem._row;
                var fromCol = fromGem._col;
                var toRow = toGem._row;
                var toCol = toGem._col;
                this._gems[fromRow][fromCol] = toGem;
                this._gems[toRow][toCol] = fromGem;                
                fromGem.swap(toGem);   
                
                this._interractionLock = 200;
                
                return true;
            }                    
        }
        
        return false;
    };
    
    this.checkMatch3 = function(gem1, gem2, gem3)
    {
        return gem1 != null && gem2 != null && gem3 != null && gem1.isMatched(gem2) && gem2.isMatched(gem3) && gem3.isMatched(gem1);
    }
    
    this.checkSwap = function(fromGem, toGem)
    {
        var row = toGem._row;
        var col = toGem._col;
        var res = false;
        
        // Vertical check
        for (var i = 0; i <= 2; ++i)
        {
            var gem1 = this.getGemAt(row - 2 + i, col);
            var gem2 = this.getGemAt(row - 1 + i, col);
            var gem3 = this.getGemAt(row + i, col);
                      
            if (this.checkMatch3(gem1 == fromGem ? toGem : (gem1 == toGem) ? fromGem : gem1,
                 gem2 == fromGem ? toGem : (gem2 == toGem) ? fromGem : gem2,  
                 gem3 == fromGem ? toGem : (gem3 == toGem) ? fromGem : gem3))
            {
                res = true;
                break;
            }
        }
        
        if (!res)
        {
            // Horizontal check
            for (var i = 0; i <= 2; ++i)
            {
                var gem1 = this.getGemAt(row, col - 2 + i);
                var gem2 = this.getGemAt(row, col - 1 + i);
                var gem3 = this.getGemAt(row, col + i);

                if (this.checkMatch3(gem1 == fromGem ? toGem : (gem1 == toGem) ? fromGem : gem1,
                    gem2 == fromGem ? toGem : (gem2 == toGem) ? fromGem : gem2,  
                    gem3 == fromGem ? toGem : (gem3 == toGem) ? fromGem : gem3))
                {
                    res = true;
                    break;
                }
            }
        }
        
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
    
    this.simulateRandomPlay = function()
    {
        var rndRow = Math.floor((Math.random() * (this._rows - 2)) + 1);
        var rndCol = Math.floor((Math.random() * (this._cols - 2)) + 1);
        
        this._intentSwapFromGem = this.getGemAt(rndRow, rndCol);
        
        var i = Math.floor(Math.random() * 5);
        if (i == 0)
        {
            this._intentSwapToGem = this.getGemAt(rndRow - 1, rndCol);
        }
        else if (i == 1)
        {
            this._intentSwapToGem = this.getGemAt(rndRow, rndCol + 1);
        }
        else if (i == 2)
        {
            this._intentSwapToGem = this.getGemAt(rndRow + 1, rndCol);
        }
        else
        {
            this._intentSwapToGem = this.getGemAt(rndRow, rndCol - 1);
        }
    }
    
    this.tick = function(dt)
    {
        if (this._interractionLock > 0)
        {
            this._interractionLock -= dt;
        }
        else
        {                       
            //this.simulateRandomPlay();
            
            if (this._state == BoardState.Collapse)
            {
                this.updateCollapseGems();
            }
            else if (this._state == BoardState.Explode)
            {                
                this.updateExplodeGems();   
            }
            else if (this._state == BoardState.Shuffle)
            {
                this.updateShuffleGems();
                return;
            }
            
            var swapFromGem = this._intentSwapFromGem;
            var swapToGem = this._intentSwapToGem;
            this._intentSwapFromGem = null;
            this._intentSwapToGem = null;                

            if (swapFromGem && swapToGem)
            {
                if (this.swapGems(swapFromGem, swapToGem))
                {
                    this._hintPotentialMatchTimeOut = constants.HINT_POTENTIAL_MATCH_TIME;
                    
                    this._checkForMatchesTargets = [swapFromGem, swapToGem];                                
                    if (this._state == BoardState.Idle)
                    {
                        this._state = BoardState.Explode;
                    }
                }
            }
        }     
        
        if (this._state == BoardState.Idle)
        {            
            for (var i = 0; i < this._cols * 4; ++i)
            {
                this.updatePotentialChecks();
            }

            if (this._isPotCheckDone && this._potCheckMatches.length == 0)
            {
                this.resetPotentialChecks();
                this._state = BoardState.Shuffle;

                this._intentSwapFromGem = null;
                this._intentSwapToGem = null; 
            }
                        
            if (this._hintPotentialMatchTimeOut > 0)
            {
                this._hintPotentialMatchTimeOut -= dt;
            }
            
            if (this._hintPotentialMatchTimeOut <= 0)
            {
                if (this._potCheckMatches.length >= 1)
                {
                    this._hintPotentialMatchTimeOut = constants.HINT_POTENTIAL_MATCH_TIME;

                    var idx = Math.floor(Math.min(Math.random() * this._potCheckMatches.length, this._potCheckMatches.length - 1));

                    var gem1 = this._potCheckMatches[idx][0];
                    var gem2 = this._potCheckMatches[idx][1];

                    this._effects.createHintShine(gem1);
                    this._effects.createHintShine(gem2);
                }
            }
        }
    }
    
    this.removeGem = function(gem)
    {
        if (gem)
        {
            var gemPositon = gem.getOriginalPosition();
            this._effects.createGemExplosion(gem._type, gemPositon.x, gemPositon.y);
            
            this._gems[gem._row][gem._col] = null;
            this._gemsPool.releaseView(gem);                                
        }
    }
    
    this.fillGemAt = function(row, col, type)
    {
        if (this._gems[row][col] == null)
        {
            var gem = this._gemsPool.obtainView();
            gem.onObtain({
                row: row,
                col: col,
                type: type,
                appearance: constants.FLIP_OUT,
            });            

            this._gems[row][col] = gem;
            
            return 1;
        }
        
        return 0;
    }
    
    this.fallGemTo = function(row, col)
    {
        if (this._gems[row][col] == null)
        {
            var rndType = Math.floor(Math.min(Math.random() * 5, 4)) + 1;
            var gem = this._gemsPool.obtainView();
            gem.onObtain({
                row: row,
                col: col,
                type: rndType,
                appearance: constants.GRAVITY_FALL,
            });            

            this._gems[row][col] = gem;
            
            return 1;
        }
        
        return 0;
    }
    
    this.updateShuffleGems = function()
    {
        for (var row = 0; row < this._rows; ++row)
        {
            for (var col = 0; col < this._cols; ++col)
            {
                var gem = this._gems[row][col];                
                
                if (gem && (gem._col != col || gem._row != row))
                {
                    console.log("ERROR!!");
                }
                
                this.removeGem(gem);               
                this.removeIntentGemSwap(gem);
                this.fallGemTo(row, col);
            }
        }
        
        this._state = BoardState.Explode;
        this._interractionLock = 1000;
        
        this._intentSwapFromGem = null;
        this._intentSwapToGem = null;     
    }
    
    this.updateCollapseGems = function()
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
                checkCount += this.fallGemTo(row, col);
            }
        }

        if (checkCount > 0 || this._checkForMatchesTargets)
        {                       
            this._checkForMatchesTargets = null;
            this._state = BoardState.Explode;     

            this._interractionLock = 300;      

            this.resetPotentialChecks();      
        }                
        else
        {
            this._state = BoardState.Idle;     
        }
    }
    
    this.updateExplodeGems = function()
    {
        var checkCount = 0;

        if (this._checkForMatchesTargets)
        {
            var view = this;
            this._checkForMatchesTargets.forEach(function(element, index, array) {
                var count = view.explodeMatches(element); 
                
                // Spawn magic gem
                if (count >= constants.REQUIRED_MATCHES_FOR_MAGIC && !element.isColorNeutral())
                {
                    view.fillGemAt(element._row, element._col, constants.GEM_TYPE_MAGIC);
                }
                
                checkCount += count;
            });

            this._checkForMatchesTargets = null;
        }

        for (var row = 0; row < this._rows; ++row)
        {
            for (var col = 0; col < this._cols; ++col)
            {
                var gem = this._gems[row][col];
                checkCount += this.explodeMatches(gem);                        
            }
        }                

        if (checkCount > 0)
        {
            this.resetPotentialChecks();
            this._state = BoardState.Collapse;             
        }
        else
        {                    
            this._state = BoardState.Idle;                         
        }

        this._interractionLock = 100;
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
                var g = this._gems[i][col];
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
                
                this.removeIntentGemSwap(gem);
                return 1;
            }
        }
        
        return 0;
    }
    
    this.removeIntentGemSwap = function(gem)
    {
        if (this._intentSwapFromGem == gem)
        {
            this._intentSwapFromGem = null;
        }
        else if (this._intentSwapToGem == gem)
        {
            this._intentSwapToGem = null;
        }
    }
    
    this.explodeMatches = function(fromGem)
    {
        if (fromGem)
        {
            if (fromGem.isColorNeutral())
            {
                return this.explodeMatchesMagic(fromGem);
            }
            else
            {
                return this.explodeMatchesNormal(fromGem);
            }
        }
        
        return 0;
    }
    
    this.explodeMatchesMagic = function(fromGem)
    {
        var exploded = false;
        var row = fromGem._row;
        var col = fromGem._col;        
        
        // Find checker gems
        var checkerGems = [];
        for (var i = row + 1; i < this._rows; ++i)
        {
            var gem = this._gems[i][col];
            if (!gem)
            {
                break;
            }
            if (!gem.isColorNeutral())
            {
                checkerGems.push(gem);
                break;
            }
        }
        for (var i = row - 1; i >= 0; --i)
        {
            var gem = this._gems[i][col];
            if (!gem)
            {
                break;
            }
            if (!gem.isColorNeutral())
            {
                checkerGems.push(gem);
                break;
            }
        }    

        // Vertical check    
        var verticalMatches = [];
        if (checkerGems.length >= 1)
        {
            for (var n = 0; n < checkerGems.length; ++n)
            {
                var checker = checkerGems[n];
                
                var matches = [];
                for (var i = row + 1; i < this._rows; ++i)
                {
                    var gem = this._gems[i][col];
                    if (gem && checker.isMatched(gem))
                    {
                        matches.push(gem);                
                    }
                    else
                    {
                        break;
                    }
                }
                for (var i = row - 1; i >= 0; --i)
                {
                    var gem = this._gems[i][col];
                    if (gem && checker.isMatched(gem))
                    {
                        matches.push(gem);                
                    }
                    else
                    {
                        break;
                    }
                }                   

                if (matches.length > verticalMatches.length)
                {
                    verticalMatches = matches;
                }
            }
        }
        else
        {
            for (var i = row + 1; i < this._rows; ++i)
            {
                var gem = this._gems[i][col];
                if (gem && fromGem.isMatched(gem))
                {
                    verticalMatches.push(gem);                
                }
                else
                {
                    break;
                }
            }
            for (var i = row - 1; i >= 0; --i)
            {
                var gem = this._gems[i][col];
                if (gem && fromGem.isMatched(gem))
                {
                    verticalMatches.push(gem);                
                }
                else
                {
                    break;
                }
            }    
        }
                
        if (verticalMatches.length >= constants.LEAST_MATCHES_REQUIRED - 1)
        {
            var view = this;
            verticalMatches.forEach(function(element, index, array) {
                view._player.collectGems(element._type, 1);
                view.removeGem(element);
                view.removeIntentGemSwap(element);                                
            });

            exploded = true;
        }

        // Find checker gems
        checkerGems = [];
        for (var i = col + 1; i < this._cols; ++i)
        {
            var gem = this._gems[row][i];
            if (!gem)
            {
                break;
            }
            if (!gem.isColorNeutral())
            {
                checkerGems.push(gem);
                break;
            }
        }
        for (var i = col - 1; i >= 0; --i)
        {
            var gem = this._gems[row][i];
            if (!gem)
            {
                break;
            }
            if (!gem.isColorNeutral())
            {
                checkerGems.push(gem);
                break;
            }
        }   
        
        // Horizontal check
        var horizontalMatches = [];
        if (checkerGems.length >= 1)
        {
            for (var n = 0; n < checkerGems.length; ++n)
            {
                var checker = checkerGems[n];
                
                var matches = [];
                for (var i = col + 1; i < this._cols; ++i)
                {
                    var gem = this._gems[row][i];
                    if (gem && checker.isMatched(gem))
                    {
                        matches.push(gem);
                    }
                    else
                    {
                        break;                
                    }
                }
                for (var i = col - 1; i >= 0; --i)
                {
                    var gem = this._gems[row][i];
                    if (gem && checker.isMatched(gem))
                    {         
                        matches.push(gem);
                    }
                    else
                    {
                        break;                
                    }
                }
                
                if (matches.length > horizontalMatches.length)
                {
                    horizontalMatches = matches;
                }
            }
        }
        else            
        {
            for (var i = col + 1; i < this._cols; ++i)
            {
                var gem = this._gems[row][i];
                if (gem && fromGem.isMatched(gem))
                {
                    horizontalMatches.push(gem);
                }
                else
                {
                    break;                
                }
            }
            for (var i = col - 1; i >= 0; --i)
            {
                var gem = this._gems[row][i];
                if (gem && fromGem.isMatched(gem))
                {         
                    horizontalMatches.push(gem);
                }
                else
                {
                    break;                
                }
            }   
        }
        
        if (horizontalMatches.length >= constants.LEAST_MATCHES_REQUIRED - 1)
        {
            var view = this;
            horizontalMatches.forEach(function(element, index, array) {
                view._player.collectGems(element._type, 1);
                view.removeGem(element);
                view.removeIntentGemSwap(element);                
            });

            exploded = true;
        }

        if (exploded)
        {
            this.removeGem(fromGem);
            view.removeIntentGemSwap(fromGem);
            
            var count = 1 + verticalMatches.length + horizontalMatches.length;
            this._player.addMana(count);
            return count;
        }
        
        return 0;
    }
    
    this.explodeMatchesNormal = function(fromGem)
    {
        var exploded = false;
        var row = fromGem._row;
        var col = fromGem._col;

        // Vertical check
        var verticalMatches = [];
        var verticalHasMagic = false;
        for (var i = row + 1; i < this._rows; ++i)
        {
            var gem = this._gems[i][col];
            if (gem && fromGem.isMatched(gem))
            {
                if (gem.isColorNeutral())
                {
                    verticalHasMagic = true;
                }
                
                verticalMatches.push(gem);                
            }
            else
            {
                break;
            }
        }
        for (var i = row - 1; i >= 0; --i)
        {
            var gem = this._gems[i][col];
            if (gem && fromGem.isMatched(gem))
            {
                verticalMatches.push(gem);                
            }
            else
            {
                break;
            }
        }        
        if (verticalMatches.length >= constants.LEAST_MATCHES_REQUIRED - 1)
        {
            var view = this;
            verticalMatches.forEach(function(element, index, array) {
                view.removeGem(element);
                view.removeIntentGemSwap(element);
            });

            if (verticalHasMagic)
            {
                this._player.addMana(verticalMatches.length);
            }
            exploded = true;
        }

        // Horizontal check
        var horizontalMatches = [];
        var horizontalHasMagic = false;
        for (var i = col + 1; i < this._cols; ++i)
        {
            var gem = this._gems[row][i];
            if (gem && fromGem.isMatched(gem))
            {
                if (gem.isColorNeutral())
                {
                    horizontalHasMagic = true;
                }
                horizontalMatches.push(gem);
            }
            else
            {
                break;                
            }
        }
        for (var i = col - 1; i >= 0; --i)
        {
            var gem = this._gems[row][i];
            if (gem && fromGem.isMatched(gem))
            {         
                horizontalMatches.push(gem);
            }
            else
            {
                break;                
            }
        }        
        if (horizontalMatches.length >= constants.LEAST_MATCHES_REQUIRED - 1)
        {
            var view = this;
            horizontalMatches.forEach(function(element, index, array) {
                view.removeGem(element);
                view.removeIntentGemSwap(element);
            });

            if (horizontalHasMagic)
            {
                this._player.addMana(horizontalMatches.length);
            }
            exploded = true;
        }

        if (exploded)
        {
            var count = 1 + verticalMatches.length + horizontalMatches.length;            
            this._player.collectGems(fromGem._type, count);            
            
            this.removeGem(fromGem);
            view.removeIntentGemSwap(fromGem);
            
            if (horizontalHasMagic || verticalHasMagic)
            {
                this._player.addMana(1);
            }
                        
            return count;
        }
        
        return 0;
    }
    
    this.resetPotentialChecks = function()
    {
        this._potCheckIndex = 0;        
        this._potCheckMatches = [];
        this._isPotCheckDone = false;
    }
    
    this.updatePotentialChecks = function()
    {
        if (!this._isPotCheckDone)
        {
            var row = Math.floor(this._potCheckIndex / this._rows);
            var col = Math.floor(this._potCheckIndex % this._cols);

            this.checkPotentialMatches(row, col, this._potCheckMatches);

            // Next check
            var maxChecks = this._rows * this._cols;        
            ++this._potCheckIndex;
            if (this._potCheckIndex >= maxChecks)
            {
                this._isPotCheckDone = true;
            }
        }
    }
    
    this.checkPotentialMatches = function(row, col, matchesResult)
    {
        var matches1 = this.checkHorizontalPotential1(row, col);
        var matches2 = this.checkHorizontalPotential2(row, col);
        var matches3 = this.checkHorizontalPotential3(row, col);
        var matches4 = this.checkVerticalPotential1(row, col);
        var matches5 = this.checkVerticalPotential2(row, col);
        var matches6 = this.checkVerticalPotential3(row, col);
        
        if (matches1) {
            matchesResult.push(matches1);
        }
        
        if (matches2) {
            matchesResult.push(matches2);
        }
        
        if (matches3) {
            matchesResult.push(matches3);
        }
        
        if (matches4) {
            matchesResult.push(matches4);
        }
        
        if (matches5) {
            matchesResult.push(matches5);
        }
        
        if (matches6) {
            matchesResult.push(matches6);
        }
    }
    
    this.checkHorizontalPotential1 = function(row, col)
    {
        if (col <= this._cols - 2)
        {
            var gem1 = this._gems[row][col];
            var gem2 = this._gems[row][col + 1];            
            
            if (row >= 1 && col >= 1)
            {
                var gem3 = this._gems[row - 1][col - 1];
                if (this.checkMatch3(gem1, gem2, gem3))
                {
                    return [gem3, this._gems[row][col - 1]];
                }
            }
            
            if (row <= this._rows - 2 && col >= 1)
            {
                var gem3 = this._gems[row + 1][col - 1];
                if (this.checkMatch3(gem1, gem2, gem3))
                {
                    return [gem3, this._gems[row][col - 1]];
                }
            }
        }
        
        return null;
    }
    
    this.checkHorizontalPotential2 = function(row, col)
    {
        if (col <= this._cols - 3)
        {
            var gem1 = this._gems[row][col];
            var gem2 = this.getGemAt(row, col + 1);            
            
            if (row >= 1 && col <= this._cols - 3)
            {
                var gem3 = this._gems[row - 1][col + 2];
                if (this.checkMatch3(gem1, gem2, gem3))
                {
                    return [gem3, this._gems[row][col + 2]];
                }
            }
            
            if (row <= this._rows - 2 && col <= this._cols - 3)
            {
                var gem3 = this._gems[row + 1][col + 2];
                if (this.checkMatch3(gem1, gem2, gem3))
                {
                    return [gem3, this._gems[row][col + 2]];
                }
            }
        }
        
        return null;
    }
    
    this.checkHorizontalPotential3 = function(row, col)
    {
        var gem1 = this._gems[row][col];        
        if (col <= this._cols - 2)
        {
            var gem2 = this._gems[row][col + 1];            
            if (col <= this._cols - 4)
            {                
                var gem3 = this._gems[row][col + 3];
                if (this.checkMatch3(gem1, gem2, gem3))
                {
                    return [gem3, this._gems[row][col + 2]];
                }
            }

            if (col >= 2)
            {                
                var gem3 = this._gems[row][col - 2];
                if (this.checkMatch3(gem1, gem2, gem3))
                {
                    return [gem3, this._gems[row][col - 1]];
                }
            }
        }
        return null;
    }
    
    this.checkVerticalPotential1 = function(row, col)
    {
        if (row <= this._rows - 2)
        {
            var gem1 = this._gems[row][col];
            var gem2 = this._gems[row + 1][col];
            
            if (col >= 1 && row >= 1)
            {
                var gem3 = this._gems[row - 1][col - 1];
                if (this.checkMatch3(gem1, gem2, gem3))
                {
                    return [gem3, this._gems[row - 1][col]];
                }
            }
            
            if (col <= this._cols - 2 && row >= 1)
            {
                var gem3 = this._gems[row - 1][col + 1];
                if (this.checkMatch3(gem1, gem2, gem3))
                {
                    return [gem3, this._gems[row - 1][col]];
                }
            }
        }
        
        return null;
    }
    
    this.checkVerticalPotential2 = function(row, col)
    {
        if (row <= this._rows - 3)
        {
            var gem1 = this._gems[row][col];
            var gem2 = this._gems[row + 1][col];
            
            if (col >= 1)
            {
                var gem3 = this._gems[row + 2][col - 1];
                if (this.checkMatch3(gem1, gem2, gem3))
                {
                    return [gem3, this._gems[row + 2][col]];
                }
            }
            
            if (col <= this._cols - 2)
            {
                var gem3 = this._gems[row + 2][col + 1];
                if (this.checkMatch3(gem1, gem2, gem3))
                {
                    return [gem3, this._gems[row + 2][col]];
                }
            }
        }
        
        return null;
    }
    
    this.checkVerticalPotential3 = function(row, col)
    {
        var gem1 = this._gems[row][col];
        if (row <= this._rows - 2)
        {
            var gem2 = this._gems[row + 1][col];
            if (row <= this._rows - 4)
            {                        
                var gem3 = this._gems[row + 3][col];
                if (this.checkMatch3(gem1, gem2, gem3))
                {
                    return [gem3, this._gems[row + 2][col]];
                }
            }

            if (row >= 2)
            {
                var gem3 = this._gems[row - 2][col];
                if (this.checkMatch3(gem1, gem2, gem3))
                {
                    return [gem3, this._gems[row - 1][col]];
                }
            }
        }
        
        return null;
    }
});
