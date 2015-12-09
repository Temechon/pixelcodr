var UFO = UFO || {};

/**
 * The play states
 * @namespace
 */
UFO.PlayerStates = {

	// The player can attack
	CAN_ATTACK : 0,

	// The player can buy skills : his XP is at max
	CAN_BUY_SKILLS : 1,

	// The player can buy items : his gold is at max
	CAN_BUY_ITEMS : 2,

	// The player must wait his turn : aliens can attack
	WAITING : 3,

	// The player is dead : his HP are 0
	DEAD : 4

};


/**
 * Class representing the player : base attack, defense, hp, exp, gold
 * @constructor
 */
UFO.Player = function(game) {

    /**
     * Player attack value
     * @type {number}
     */
    this.attack = 1;
    /**
     * Player defense value
     * @type {number}
     */
    this.defense = 0;
    /**
     * The player current health
     * @type {number}
     */
    this.health = 100;
    /**
     * The max health of the player
     * @type {number}
     */
    this.healthMax = 100;
    /**
     * Player experience
     * @type {number}
     */
    this.exp = 0;

    /**
     * The exp amount to get a level
     * @type {number}
     */
    this.expMax = 10;

    /**
     * The player current gold
     * @type {number}
     */
    this.gold = 0;

    /**
     * The player ma gold before buying an item
     * @type {number}
     */
    this.goldMax = 20;

    this.score = 0;

	/**
	 * The two skills linked to this player, empty at the start
	 * @type {Array}
	 */
	this.skills = [];

	// The player can attack
	this._state = UFO.PlayerStates.CAN_ATTACK;

	/**
	 * The player UI
	 * @type {UFO.PlayerUi}
	 * @private
	 */
    this._ui = new UFO.PlayerUi(game, this);
};

/**
 * Attack the player with the given attack value
 * @param a
 */
UFO.Player.prototype.damage = function(a) {
    this.defense -= a;
    if (this.defense <= 0) {
        this.health -= Math.abs(this.defense);
        this.defense = 0;

	    if (this.health <=0 ){
		    this._state = UFO.PlayerStates.DEAD;
	    }
    }
};


// STATES
UFO.Player.prototype.isDead = function() {
    return (this._state == UFO.PlayerStates.DEAD);
};

UFO.Player.prototype.canAttack = function() {
	return (this._state == UFO.PlayerStates.CAN_ATTACK);
};

UFO.Player.prototype.canBuySkills = function() {
	return (this._state == UFO.PlayerStates.CAN_BUY_SKILLS);
};

UFO.Player.prototype.canBuyItems = function() {
	return (this._state == UFO.PlayerStates.CAN_BUY_ITEMS);
};

UFO.Player.prototype.isWaiting = function() {
	return (this._state == UFO.PlayerStates.WAITING);
};


/**
 * Creates the player UI
 */
UFO.Player.prototype.createUi = function() {
    this._ui.create();
};

/**
 * Updates the player UI
 */
UFO.Player.prototype.updateUi = function() {
    this._ui.update();
};

/**
 * Heal the player with the given amount
 * @param healValue
 */
UFO.Player.prototype.heal = function(healValue) {
    this.health += healValue;
    this.health = this.health > this.healthMax ? this.healthMax:this.health;
};

// SKILLS
/**
 * Add a skill to the player
 * @param skill {UFO.Skill}
 */
UFO.Player.prototype.addSkill = function(skill) {
    this.skills.push(skill);
	this.exp = 0;
	// TODO Increase exp max
	this._state = UFO.PlayerStates.CAN_ATTACK;
	this.updateUi();
};

/**
 * Remove the given skill from the player list of skill
 * @param skill
 */
UFO.Player.prototype.removeSkill = function(skill) {
	var index = this.skills.indexOf(skill);
	this.skills.splice(index, 1);
};

// STATS
UFO.Player.prototype.addGold = function(g) {
	this.gold += g;
	if (this.gold >= this.goldMax) {
		this._state = UFO.PlayerStates.CAN_BUY_ITEMS;
	}
};

UFO.Player.prototype.addXp = function(x) {
	this.exp += x;
	if (this.exp >= this.expMax) {
		this._state = UFO.PlayerStates.CAN_BUY_SKILLS;
	}
};

/**
 * Function called when the turn is over. Increase cooldowns, turn number, ..
 */
UFO.Player.prototype.endOfTurn = function() {
	this.skills.forEach(function(s) {
		s.update();
	});

	this.updateUi();
	this.turn ++;
};


