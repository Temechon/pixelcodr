var UFO = UFO || {};

UFO.Gameboard = function(game) {
    this.game = game;

	// CONSTANTS
    this.NUMBER_ITEM_COL = 6;
    this.NUMBER_ITEM_LINE = 6;

	// The sprite size
	this.SIZE = 90;
	// margin between items
    this.MARGIN = 10;
	// Start point
    this.STARTX = 140;
    this.STARTY = 230;

	// Contains all items on the board : [col][line]
    this.items = [];

    // Contains all particles emitters
    this.emitters = [];

    // Group containing all items
    this.itemsGroup;

    // The array containing all selected item
    this.selectedItems = [];

	// Containing all link between objects
	this.paths = [];

    // The item factory
    this.itemFactory = new UFO.BoardItemFactory(game);

    // The number of turn
    this.turn = 1;

	// Set to true if player action should be deactivated, false otherwise
	this.deactivateAction = false;

	// The text to display when an alien or a laser is selected
	this.damageText = null;
};

/**
 * Creates the board game
 * @param onItemSelected
 * @param onItemReleased
 * @param context
 * @returns {Array}
 */
UFO.Gameboard.prototype.create = function() {

    this.itemsGroup = this.game.add.group();

    for (var j=0; j<this.NUMBER_ITEM_COL; j++) {
        this.items.push([]);
        this.emitters.push([]);

        for (var i=0; i<this.NUMBER_ITEM_LINE; i++) {
            this.addItemOnBoard(this.MARGIN*j+this.STARTX+(j*this.SIZE), -100, i, j);

            var emitter = this.game.add.emitter(
                this.MARGIN*j+this.STARTX+(j*this.SIZE),
                this.MARGIN*i+this.STARTY+(i*this.SIZE),
                100);
	        emitter.makeParticles("explosion", 20);
            emitter.gravity = 100;
            emitter.width = this.SIZE;
            emitter.setXSpeed(-500, 500);
            emitter.setYSpeed(-500, 500);
            emitter.setScale(1, 0.1, 1, 0.1, 250, Phaser.Easing.Quintic.In);
            this.emitters[j][i] = emitter;
        }
    }



};


// ITEM FUNCTIONS
/**
 * Return an item by a pixel position
 * @param x
 * @param y
 * @returns {Phaser.Sprite}
 */
UFO.Gameboard.prototype.getItemByPosition = function(x, y) {
    var res = null;
	var that = this;
    this.items.forEach(function(array) {
        array.forEach(function(item) {
	        if (item) {
	            if (Phaser.Rectangle.containsRaw(item.x-(that.SIZE/2), item.y-(that.SIZE/2), that.SIZE, that.SIZE, x, y)){
	                res = item;
	            }
	        }
        });
    });
    return res;
};

/**
 * Returns the item at the given line an²d col
 * @param line
 * @param col
 * @returns {Phaser.Sprite}
 */
UFO.Gameboard.prototype.getItem = function(line, col) {
    return this.items[col][line];
};

/**
 * Returns the line given in parameter
 * @param line
 */
UFO.Gameboard.prototype.getLine = function(line) {
	var res = [];
	this.items.forEach(function(array) {
		res.push(array[line]);
	});
	return res;
};

/**
 * Creates a random item on the board
 * @param x
 * @param y
 * @param line
 * @param col
 * @returns {Phaser.Sprite}
 */
UFO.Gameboard.prototype.addItemOnBoard = function(x, y, line, col) {

	var g = this.itemFactory.create(x, y, line, col);

    g.events.onInputDown.add(this.onItemSelected, this);
    g.events.onInputUp.add(this.onItemReleased, this);

    // Add it to the group
    this.itemsGroup.add(g);
    // Add it to the board
    this.items[col][line] = g;

    // tween
    var tween = this.game.add.tween(g);
    tween.to({y:this.MARGIN*line+this.STARTY+(line*this.SIZE)}, 4500/(line+5), Phaser.Easing.Elastic.InOut, true);

    return g;
};

/**
 * Updates the color of all sprites with a different type that the one given in parameter
 * @param type
 * @private
 */
UFO.Gameboard.prototype._setOpacity = function(type, value) {
	this.items.forEach(function(column) {
		column.forEach(function(i) {
			if (i && !i.canBeLinked(type) && i.type != type) {
				i.alpha = value;
			}
		});
	});
};

/**
 * Vibrates the given item during a small amount of time
 * @param item
 */
UFO.Gameboard.prototype.vibrate = function(item) {

	var tween = this.game.add.tween(item);
	var start = item.y +10;

	tween.from({y:start}, 200, Phaser.Easing.Bounce.Out, true);


};

/**
 * Select the given item
 * @param item
 * @private
 */
UFO.Gameboard.prototype._selectItem = function(item) {

	item.selected = true;
	this.selectedItems.push(item);
	this.vibrate(item);
};

/**
 * Unselect the last selected item
 * @private
 */
UFO.Gameboard.prototype._unselectLastOne = function() {
	var item = this.selectedItems.pop();
	item.selected = false;

    // Remove the red cross on aliens
    if (item.type == "UFO.Alien") {
        item.removeCross();
    }
    this.updateCrossOnAliens();

	var path = this.paths.pop();
	path.destroy();

	this._updateDamageText();
};

/**
 * Removes all the selected ones
 */
UFO.Gameboard.prototype.popSelectedOnes = function() {
	var that = this;

    // The number of removed elements
	var scoreThisround = 0;

    var totalAttackSelected = 0;
    this.selectedItems.forEach(function(it) {
        totalAttackSelected += it.attackValue;
    });
    // Add the player attack
    totalAttackSelected += that.game.player.attack;

    this.selectedItems.forEach(function(item) {
        scoreThisround += item.action(that,totalAttackSelected);
    });

    return scoreThisround;

};

/**
 * Remove the given specific item from the selected item array
 * @param item
 */
UFO.Gameboard.prototype.removeItem = function(item) {

	var e = this.emitters[item.col][item.line];
	// Update the particule texture
	e.forEach(function(p) {
		p.loadTexture(item.particules);
	});

	e.start(true, 250, null, 20);

    // remove with true detroys all of its child
	this.itemsGroup.remove(item, true);
	this.items[item.col][item.line] = null;
};

/**
 * Fill the empty emplacement in the grid with new random items
 */
UFO.Gameboard.prototype.fillGrid = function() {
	for (var i=0; i<this.items.length; i++ ){
		for (var j=0; j<this.items[i].length; j++) {
			var it = this.items[i][j];
			if (! it) {
				this.addItemOnBoard(this.MARGIN*i+this.STARTX+(i*this.SIZE), -100, j, i);
			}
		}
	}
};

/**
 * Updates the game board after an item has been removed.
 * Updates player UI, updates item with graviuty, fill the grid with new items.
 * This actions takes a quarter second
 * @private
 */
UFO.Gameboard.prototype._updateGameBoard = function() {

	var that = this;

	// Update the player UI if needed
	this.game.player.updateUi();

	// Update the game with new item after a quarter second
	this.game.time.events.add(Phaser.Timer.QUARTER, function() {
		that.updateItemsWithGravity();
		that.fillGrid();
	}, this);
};


// GRAVITY FUNCTIONS
/**
 * Moves all items to the bottom of the board
 */
UFO.Gameboard.prototype.updateItemsWithGravity = function() {
	var isStable = false;
	while (!isStable) {
		isStable = true;
		// For all columns
		for (var i=0; i<this.items.length; i++) {
			// The last line is not necessary to update
			// => For all lines but the last one
			for (var j=0; j<this.items[i].length-1; j++) {
				// If no item is under the current one, make this one fall
				var current = this.items[i][j];
				if (current) {
					var underCurrent = this.items[i][j+1];
					if (!underCurrent){
						this._moveItem(current, i, j+1);
						isStable &= false;
					}else {
						isStable &= true;
					}
				}

			}
		}
	}
};

/**
 * Move the given sprite to the given col and line
 * @param sprite
 * @param col
 * @param line
 * @private
 */
UFO.Gameboard.prototype._moveItem = function(sprite, col, line) {

	this.items[col][line] = sprite;
	this.items[sprite.col][sprite.line] = null;
	sprite.col = col;
	sprite.line = line;
	var t = this.game.add.tween(sprite);
	t.to({y:this.MARGIN*line+this.STARTY+(line*this.SIZE)}, 350, Phaser.Easing.Bounce.Out, true);
};


// POINTER EVENTS
/**
 * Action launched when an item is selected :
 * The item is set as selected;<br/>
 * an event is added on the pointer move
 * @param sprite
 * @param pointer
 */
UFO.Gameboard.prototype.onItemSelected = function(sprite, pointer) {
    var that = this;
	var canDisplayDamageText = false;

    // The event listener can be executed only if it's the player turn
    if (this.game.ufostate == UFO.GameStates.PLAYER_TURN) {

        // Add this item in the stack
        this._selectItem(sprite);

        // Set limited opacity on all other sprite of different type
        this._setOpacity(sprite.type, 0.5);

	    // If sprite is laser or alien, display the attack tooltip
	    if (sprite.type =='UFO.Alien' || sprite.type =='UFO.Laser') {
		    canDisplayDamageText = true;
		    var totalAttack = that.getTotalAttack();
		    if (!that.damageText)  {
			    that.damageText = that.game.add.bitmapText(pointer.x+10, pointer.y, 'boombox_stroke', String(totalAttack) , 40);
		    }
	    }

        // move callback
        this.game.input.addMoveCallback(function(pointer) {

            // The input must be in game and down
            if (pointer.isDown && pointer.withinGame) {

	            // The attack tooltip is displayed only if the selected item is a laser or an alien
	            if (canDisplayDamageText) {
		            that.damageText.x = pointer.x+10;
		            that.damageText.y = pointer.y;
	            }

                // Get input position
                var item = that.getItemByPosition(pointer.x, pointer.y);
                if (item) {
                    // Check if this item is a neighbour of the current one
                    if (that._isInPath(item) && that._canBeLinkedWith(item)) {
                        if (!that._isSelected(item)) {
                            that._selectItem(item);
                            that.drawPath();
	                        if (canDisplayDamageText) {
	                            that._updateDamageText();
	                        }
                        } else if (that._isPreviousOne(item)) {
                            that._unselectLastOne();
                        }

                    }
                    // For each selected alien, if the selected attack is greater than the alien health, set a red cross on it
                    that.updateCrossOnAliens();
                }
            }
        }, this);
    }

};

/**
 * Action launched when the pointer is released. All selected item are reset, opacity is reset, and all paths are cleared
 * @param sprite
 * @param pointer
 */
UFO.Gameboard.prototype.onItemReleased = function(sprite, pointer) {
    // The event listener can be executed only if it's the player turn
    this.game.input.deleteMoveCallback(0);

    if (this.selectedItems.length >= 3) {
        var count = this.popSelectedOnes();
        this.turn++;
        //this.itemFactory.increaseAlienWeight();
        this.game.player.addXp(count);

        this._updateGameBoard();

        // Alien can attack when the grid is filled
        this.game.time.events.add(Phaser.Timer.SECOND, function() {
            // Set to true to end the player turn
            this.game.ufostate = UFO.GameStates.ALIEN_TURN;
        }, this);
    }

    if (this.damageText) {
        this.damageText.destroy();
	    this.damageText = null;
    }
    this.resetSelected();
    this.resetCross();
    this.selectedItems = [];
    // reset opacity on sprites
    this.resetOpacity();
    // remove draw path
    this.clearPath();
};



// PATH FUNCTIONS
/**
 * Draw the path between the two last selected item
 */
UFO.Gameboard.prototype.drawPath = function() {

	var i1 = this.selectedItems[this.selectedItems.length-1];
	var i2 = this.selectedItems[this.selectedItems.length-2];
	this._drawLine(i2, i1);
};

/**
 * Destroy and re-creates the damage text to be on top of the path sprites
 * @private
 */
UFO.Gameboard.prototype._updateDamageText = function() {
	if (this.damageText) {
		var text = this.getTotalAttack(),
			x = this.damageText.x,
			y = this.damageText.y;
		this.damageText.destroy();
		this.damageText = this.game.add.bitmapText(x, y, 'boombox_stroke', String(text) , 40);
	}
};

/**
 * Removes all path drawn in the screen
 */
UFO.Gameboard.prototype.clearPath = function() {
	this.paths.forEach(function(p) {
		p.destroy();
	});

	this.paths = [];
};

/**
 * Draw a path between the two given items
 * @param from The first item
 * @param to The last item
 * @private
 */
UFO.Gameboard.prototype._drawLine = function(from, to) {
	var x, y, link;
	if (from.col == to.col) {
		x = from.x;
		y = (from.y+to.y)*0.5;
		link = "linkv";
	} else if (from.line == to.line) {
		// same line
		x = (from.x+to.x)*0.5;
		y = from.y;
		link = "linkh";
	} else if ((from.col == to.col-1 && from.line == to.line-1) || (from.col == to.col+1 && from.line == to.line+1)) {
		// oblique from left to right
		x = (from.x+to.x)*0.5;
		y = (from.y+to.y)*0.5;
		link = "linkol";
	} else if ((from.col == to.col-1 && from.line == to.line+1)||(from.col == to.col+1 && from.line == to.line-1)) {
		x = (from.x+to.x)*0.5;
		y = (from.y+to.y)*0.5;
		link = "linkor";
	}
	var l = this.game.add.sprite(x, y, link);
	l.anchor.set(0.5);
	this.paths.push(l);
};

/**
 * Set a red cross on aliens that can be removed with the selected attack
 */
UFO.Gameboard.prototype.updateCrossOnAliens = function() {
    var playerAttack = this.game.player.attack;
    var laserAttack = 0;

    // Get the laser attack
    this.selectedItems.forEach(function(item) {
        laserAttack += item.attackValue;
    });

    // Set red cross on aliens
    this.selectedItems.forEach(function(item) {
        if (item.type == "UFO.Alien") {
            if (item.canBeDead(playerAttack+laserAttack)) {
                item.addCross();
            } else {
                item.removeCross();
            }
        }
    });

};

/**
 * Returns the total attack of selected items (laser) + player base attack
 */
UFO.Gameboard.prototype.getTotalAttack = function() {
	var total = 0;
	this.selectedItems.forEach(function(item) {
		total += item.attackValue;
	});
	total += this.game.player.attack;

	return total;
};



// "IS" FUNCTION
/**
 * Returns true if the given item is a neighbour to the last selected item.
 * @param item
 * @returns {boolean}
 * @private
 */
UFO.Gameboard.prototype._isInPath = function(item) {
	var last = this.selectedItems[this.selectedItems.length-1];
	var c = last.col;
	var l = last.line;
	var nc = item.col;
	var nl = item.line;

	return ((nc == c-1) || (nc == c+1) || (nc == c)) && ((nl == l-1) || (nl == l+1) || (nl == l));

};

/**
 * Returns true if the last selected item and the given item are of the same type, or if the item type belongs
 * to the array 'can be linked with' of the last selected item
 * @param item
 * @returns {boolean}
 * @private
 */
UFO.Gameboard.prototype._canBeLinkedWith = function(item) {
	var last = this.selectedItems[this.selectedItems.length-1];
	return (last.type == item.type || last.canBeLinked(item));
};

/**
 * Returns true if the given item is already selected
 * @param item
 * @returns {boolean}
 * @private
 */
UFO.Gameboard.prototype._isSelected = function(item) {
	return item.selected;
};

/**
 * Return true if the given item is the last selected one
 * @param item
 * @returns {boolean}
 * @private
 */
UFO.Gameboard.prototype._isPreviousOne = function(item) {
	if (this.selectedItems.length >= 2) {
		var i = this.selectedItems[this.selectedItems.length-2];
		return (i.col == item.col && i.line == item.line);
	} else {
		return false;
	}
};



// RESET
/**
 * Reset the opacity of all sprites
 */
UFO.Gameboard.prototype.resetOpacity = function() {
	this.items.forEach(function(column) {
		column.forEach(function(i) {
			if (i) {
				i.alpha = 1;
			}
		});
	});
};

/**
 * Reset the attribute 'selected' for all items
 */
UFO.Gameboard.prototype.resetSelected = function() {
	this.items.forEach(function(column) {
		column.forEach(function(i) {
			if (i) {
				i.selected = false;
			}
		});
	});
};

UFO.Gameboard.prototype.resetCross = function() {
	this.items.forEach(function(column) {
		column.forEach(function(i) {
			if (i && i.removeCross) {
				i.removeCross();
			}
		});
	});
};

/**
 * It's the alien turn ! All aliens present in the map that are not spawn this turn wil attack the player
 */
UFO.Gameboard.prototype.alienTurn = function() {
    var sum = 0;
    this.items.forEach(function(array) {
        array.forEach(function(it) {
            sum += it.getDamageValue();

            // Attack animation !
            if (it.attackAnimation) {
                it.attackAnimation();
            }
            if (it.setAlive) {
                it.setAlive();
            }
        });
    });
    this.game.player.damage(sum);

	// END OF THE PLAYER TURN
	this.game.player.endOfTurn();

    // Update the player UI if needed
    this.game.player.updateUi();

	// Player turn when alien animation is over
	this.game.time.events.add(Phaser.Timer.QUARTER*3, function() {
		this.game.ufostate = UFO.GameStates.PLAYER_TURN;
	}, this);
};


// SKILLS ACTIONS
/**
 * Delete the line at the given index. All items on this line
 * are added to the player score
 */
UFO.Gameboard.prototype.deleteLine = function(index) {

	var line = this.getLine(index);
	var scoreThisround = 0;
	var that = this;
	line.forEach(function(item) {
		// Action the current item with a max total attack
		// to remove all aliens (if any in this line)
		scoreThisround += item.action(that,999);
	});

	this.game.player.addXp(scoreThisround);

	this._updateGameBoard();
};
