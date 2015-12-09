var UFO = UFO || {};

/**
 * Constructor. Defines a default skill
 * @param game
 * @constructor
 */
UFO.Skill = function(game) {

    this.game = game;

    // SKILL_1 or SKILL_2
    this.pos;

    // The current number of turn after firing this skill. If cooldown == cooldownMax, this skill is ready
	// CooldownMax = the number of turn to reload this skill.
    this.cooldown = 10;
	this.cooldownText = null;
	this.cooldownMax = 10;

    // The sprite key
    this.spriteKey = '';

    // if true, this skill is destroyed at the end of the turn
    this.isTemporary = false;

    // The sprite linked to this skill
    this.sprite = null;

	// The action called when selecting this skill.
	// Must be defined to overrride the default skill action (for example for the skill chooser)
	this.temporaryAction = null;
	this.temporaryContext = null;
};

// The position to display the skill
UFO.Skill.SKILL_1 = new Phaser.Point(440,865);
UFO.Skill.SKILL_2 = new Phaser.Point(600,865);

/**
 * The action this skill will fire
 */
UFO.Skill.prototype.doAction = function() {

};

/**
 * Returns true if this skil is ready to be fired
 */
UFO.Skill.prototype.isReady = function() {
	return (this.cooldown == this.cooldownMax);
};

/**
 * Incrementss the current cooldown of this skill
 */
UFO.Skill.prototype._updateCooldown = function() {
	if (! this.isReady()) {
		this.cooldown ++;
	}
};

/**
 * Display the skill cooldown as a text in the sprite
 */
UFO.Skill.prototype.updateCooldownText = function() {
	if (!this.cooldownText) {
		// creates the text
		this.cooldownText = this.game.add.bitmapText(this.pos.x+20, this.pos.y+20, "boombox_stroke", String(this.cooldown+"/"+this.cooldownMax), 15);
	}
	// Update it with the cooldown
	this.cooldownText.text = String(this.cooldown+"/"+this.cooldownMax);
};

/**
 * Function called at the end of a turn
 */
UFO.Skill.prototype.update = function() {
	this._updateCooldown();
	this.updateCooldownText();
};

/**
 * Set a temporary action to this skill
 * @param action
 */
UFO.Skill.prototype.setTemporaryAction = function(action, context) {
	this.temporaryAction = action;
	this.temporaryContext = context;
};

/**
 * Display the skill
 */
UFO.Skill.prototype.display = function() {
    // Display
    if (!this.sprite) {
        this.sprite = this.game.add.sprite(this.pos.x, this.pos.y, this.spriteKey);

	    this.sprite.skill = this;

	    this.sprite.inputEnabled = true;
        // Add action linked to this skill
	    // If an action is given in parameter, set it
	    if (this.temporaryAction) {
		    this.sprite.events.onInputDown.add(this.temporaryAction, this.temporaryContext);
	    } else {
		    // Otherwise, the skill action is set
	        this.sprite.events.onInputDown.add(this.doAction, this);
	    }
    }
	this.updateCooldownText();
};

/**
 * Delete the sprite
 */
UFO.Skill.prototype.dispose = function() {
	this.sprite.destroy(true);
	this.cooldownText.destroy(true);
	this.sprite = null;
	this.temporaryAction = null;
	this.temporaryContext = null;
	this.pos = null;
};

/**
 * Clone this skill and creates a new one
 * @abstract
 */
UFO.Skill.prototype.clone = function() {
};