var UFO = UFO || {};

/**
 * Class representing the a laser : its attack value is added to the base attack damage of the player
 * @constructor
 */
UFO.Potion = function(game, x, y, line, col) {

    UFO.BoardItem.call(this, game, x, y, "potion", line, col);

    this.type = "UFO.Potion";

    // The health value of this item
    this.healthValue = 1;
};

UFO.Potion.prototype = Object.create(UFO.BoardItem.prototype);
UFO.Potion.prototype.constructor = UFO.Potion;

UFO.Potion.prototype.action = function(gameboard, totalAttack) {
    gameboard.game.player.heal(this.healthValue);
    gameboard.removeItem(this);
    return 0;
};
