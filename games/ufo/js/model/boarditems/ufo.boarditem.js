var UFO = UFO || {};

/**
 * Constructor. Extends the default phaser sprite
 * @param game
 * @param x
 * @param y
 * @param key
 * @constructor
 */
UFO.BoardItem = function(game, x, y, key, line, col) {
	Phaser.Sprite.call(this, game, x, y, key);

    this.game = game;

	this.anchor.set(0.5);
	this.inputEnabled = true;

	// Custom properties
	this.type = "UFO.BoardItem";
	this.line = line;
	this.col = col;

	// True if this item is selected
	this.selected = false;

	// An array containing all type this item can be linked to (added to its own type ofc)
	this.canBeLinkedWith = [];

    // The default attack value of this item
    this.attackValue = 0;
    // The damage done to player
    this.damageValue = 0;
    // The default defense value of this item
    this.defenseValue = 0;
    // The default defense value of this item
    this.healthValue = 0;
	// The particule used for this item
	this.particules = "explosion";
};

UFO.BoardItem.prototype = Object.create(Phaser.Sprite.prototype);
UFO.BoardItem.prototype.constructor = UFO.BoardItem;

/**
 * Another item can be linked with this one if :
 * - they have the same type
 * - the item type is in the attribute canBeLinkedWith of this item
 * @param item The item to test or its type
 */
UFO.BoardItem.prototype.canBeLinked = function(item) {
	var canBeLinked = false;
	var otherType = item.type || item;
	this.canBeLinkedWith.forEach(function(type) {
		if (type == otherType) {
			canBeLinked = true;
		}
	});
	return canBeLinked || (item.type == this.type);
};

/**
 * Returns the damage value of this item
 * @returns {number}
 */
UFO.BoardItem.prototype.getDamageValue = function() {
    return this.damageValue;
};


