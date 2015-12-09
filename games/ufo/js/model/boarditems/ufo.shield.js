var UFO = UFO || {};

/**
 * Class representing a shield
 * @constructor
 */
UFO.Shield = function(game, x, y, line, col) {

    UFO.BoardItem.call(this, game, x, y, "shield", line, col);

    // The defense value of this crystal
    this.defenseValue = 1;

    this.type = "UFO.Shield";

	this.particules = 'shield_explosion';
};

UFO.Shield.prototype = Object.create(UFO.BoardItem.prototype);
UFO.Shield.prototype.constructor = UFO.Shield;

UFO.Shield.prototype.action = function(gameboard, totalAttack) {
    gameboard.game.player.defense += this.defenseValue;
    gameboard.removeItem(this);
    return 0;
};
