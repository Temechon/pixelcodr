var UFO = UFO || {};

/**
 * Constructor. Extends the default phaser sprite
 * @param game
 * @param x
 * @param y
 * @param key
 * @constructor
 */
UFO.Alien = function(game, x, y, line, col) {
	UFO.BoardItem.call(this, game, x, y, "kzark", line, col);

	this.type = "UFO.Alien";

    // The attack power
	this.damageValue = 1;
    // The defense power
    this.defense = 0;
    // Hit points
	this.health = 1;
    // true if this alien just spawned, false otherwise
    this.justSpawned = true;

	this.particules = 'alien_explosion';

	// An alien can be linked with a laser to increase the player damage
	this.canBeLinkedWith.push("UFO.Laser");

    this._addStats();

    // The red cross
    this.cross = game.make.sprite(0, 0, "cross");
    this.cross.anchor.set(0.5, 0.5);
    this.cross.kill();
    this.addChild(this.cross);

};

UFO.Alien.prototype = Object.create(UFO.BoardItem.prototype);
UFO.Alien.prototype.constructor = UFO.Alien;

/**
 * Add the attack text at the top right of the sprite
 * @private
 */
UFO.Alien.prototype._addStats = function() {

    // HP in the top right
    var style = { font: "24px Arial", fill: "#00ff00", align: "center" };
    this.healthText = this.game.add.text(40, -40, this.health, style);
    this.healthText.anchor.set(0.5, 0.5);
    this.healthText.bringToTop = true;
    this.addChild(this.healthText);

    // attack in the bootom left right
    var style2 = { font: "24px Arial", fill: "#ff0000", align: "center" };
    var t = this.game.add.text(-40, 40, this.damageValue, style2);
    t.anchor.set(0.5, 0.5);
    t.bringToTop = true;
    this.addChild(t);

    // defense in the bootom left right
    var style3 = { font: "24px Arial", fill: "#0000ff", align: "center" };
    var tt = this.game.add.text(40, 40, String(this.defense), style3);
    tt.anchor.set(0.5, 0.5);
    tt.bringToTop = true;
    this.addChild(tt);

};

/**
 * Damage the HP of this alien with the given attack value;
 * @param attack
 */
UFO.Alien.prototype.damage = function(attack) {
    this.health -= attack;
    this.healthText.text = this.health;
};

/**
 * Returns the damage value this alien can send to the player. This value is 0 is this alien just spawned this turn
 * @returns {number}
 */
UFO.Alien.prototype.getDamageValue = function() {
    if (this.justSpawned) {
        return 0;
    } else {
        return this.damageValue;
    }
};

/**
 * Add a red cross on this alien
 */
UFO.Alien.prototype.addCross = function() {
    this.cross.reset(0,0);
};

/**
 * Remove the red cross
 */
UFO.Alien.prototype.removeCross = function() {
    if (this.cross.alive) {
        this.cross.kill();
    }
};

/**
 * Returns true if the attack can kill this alien
 * @param attack
 * @returns {boolean}
 */
UFO.Alien.prototype.canBeDead = function(attack) {
    return ((this.health+this.defense) - attack <= 0 );
};


UFO.Alien.prototype.action = function(gameboard, totalAttack) {
    this.damage(totalAttack);
    if (this.health <= 0) {
        gameboard.removeItem(this);
        return 1;
    }
    return 0;
};

/**
 * Set the alien stats with the given parameters
 * @param health
 * @param attack
 * @param defense
 */
UFO.Alien.prototype.setStats = function(health, attack, defense) {
    this.damageValue = attack;
    this.health = health;
    this.defense = defense;
};


UFO.Alien.prototype.attackAnimation = function() {
    if (!this.justSpawned) {
        // Update the alien sprite
        this.loadTexture('alien_attack');

        var that = this;
        // Reset the alien sprite
        this.game.time.events.add(Phaser.Timer.QUARTER*3, function() {
            that.loadTexture('kzark');
        }, this);
    }
};

UFO.Alien.prototype.setAlive = function() {
    this.justSpawned = false;
};






