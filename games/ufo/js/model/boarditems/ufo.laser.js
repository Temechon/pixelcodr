var UFO = UFO || {};

/**
 * Class representing the a laser : its attack value is added to the base attack damage of the player
 * @constructor
 */
UFO.Laser = function(game, x, y, line, col) {

    UFO.BoardItem.call(this, game, x, y, "laser", line, col);

    // The attack value of this laser
    this.attackValue = 3;

    this.type = "UFO.Laser";

	// A laser can be linked to an alien to increase the player attack value
	this.canBeLinkedWith.push("UFO.Alien");

	this.particules = 'laser_explosion';
};

UFO.Laser.prototype = Object.create(UFO.BoardItem.prototype);
UFO.Laser.prototype.constructor = UFO.Laser;


UFO.Laser.prototype.action = function(gameboard, totalAttack) {
    gameboard.removeItem(this);
    return 0;
}
