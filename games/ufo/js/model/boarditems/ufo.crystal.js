var UFO = UFO || {};

/**
 * Class representing the player : base attack, defense, hp, exp, gold
 * @constructor
 */
UFO.Crystal = function(game, x, y, line, col) {

    UFO.BoardItem.call(this, game, x, y, "crystal", line, col);

    // The gold value of this crystal
    this.goldValue = 1;

    this.type = "UFO.Crystal";
	this.particules = 'crystal_explosion';
};

UFO.Crystal.prototype = Object.create(UFO.BoardItem.prototype);
UFO.Crystal.prototype.constructor = UFO.Crystal;



UFO.Crystal.prototype.action = function(gameboard, totalAttack) {
    gameboard.game.player.addGold(this.goldValue);
    gameboard.removeItem(this);
    return 0;
};