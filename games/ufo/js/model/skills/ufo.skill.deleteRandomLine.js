var UFO = UFO || {};

/**
 * Constructor. Defines a default skill
 * @param game
 * @constructor
 */
UFO.DeleteRandomLineSkill = function(game) {
	UFO.Skill.call(this, game);

    this.spriteKey = 'delete_random_line';

	this.cooldown = 20;
	this.cooldownMax = 20;

};

UFO.DeleteRandomLineSkill.prototype = Object.create(UFO.Skill.prototype);
UFO.DeleteRandomLineSkill.prototype.constructor = UFO.DeleteRandomLineSkill;

/**
 * This skill will remove a random line in the game board
 */
UFO.DeleteRandomLineSkill.prototype.doAction = function() {

	if (this.isReady()) {
		var min = 0,
			max = this.game.board.NUMBER_ITEM_LINE,
			index = this.game.rnd.integerInRange(min, max);

		this.game.board.deleteLine(index);
		this.cooldown = 0;
		this.updateCooldownText();
	}
};

UFO.DeleteRandomLineSkill.prototype.clone = function() {
	var res = new UFO.DeleteRandomLineSkill(this.game);

	res.doAction = this.doAction;

	return res;
};