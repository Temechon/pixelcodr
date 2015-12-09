var UFO = UFO || {};

/**
 * Class representing the player UI
 * @constructor
 */
UFO.PlayerUi = function(game, player) {
    this.game = game;
	this.player = player;

    this.lifebar;
    this.lifebarHeight;

    this.healthText;
};

/**
 * Creates the player UI
 */
UFO.PlayerUi.prototype.create = function() {

    // lifebar
    this.lifebar = this.game.add.sprite(310, 7, 'lifebar');
    this.lifebar.cropEnabled = true;
    this.lifebarHeight = this.lifebar.height;
    // lifebar max
    this.game.add.sprite(310, 7, 'lifebar_max');

    // health text
    this.healthText = this.game.add.bitmapText(325, 60, 'boombox',String(this.player.health), 40);

    // xp bar
    this.xpbar = this.game.add.sprite(468, 38, 'xp');
    this.xpbar.cropEnabled = true;
    this.xpwidth = this.xpbar.width;
    // xp bar max
    this.game.add.sprite(465, 35, 'xp_max');
    // xp text
    this.game.add.bitmapText(475, 42, 'boombox', 'XP', 20);

    // gem bar
    this.gembar = this.game.add.sprite(468, 88, 'gem');
    this.gembar.cropEnabled = true;
    this.gembarWidth = this.gembar.width;
    // gem bar max
    this.game.add.sprite(465, 85, 'gem_max');
    // gem text
    this.game.add.bitmapText(475, 92, 'boombox', 'GEM', 20);

    // attack & defense
    this.game.add.sprite(40, 25, 'attack');
    this.attackText = this.game.add.bitmapText(70, 50, 'boombox', String(this.player.attack) , 50);
    this.game.add.sprite(170, 25, 'defense');
    this.defenseText = this.game.add.bitmapText(200, 50, 'boombox', String(this.player.defense) , 50);

    // items
    this.game.add.sprite(40, 865, 'item1');
    this.game.add.sprite(200, 865, 'item2');

    // skills
    this.game.add.sprite(440, 865, 'skill1');
	this.game.add.sprite(600, 865, 'skill2');

    this._updateXpBar();
    this._updateGemBar();
};


/**
 * Update the life bar of the player according to its current health and max health
 * @private
 */
UFO.PlayerUi.prototype._updateLifeBar = function() {

    var newY = (this.player.health / this.player.healthMax) * this.lifebarHeight;
    newY = newY<=0?0:newY>=this.lifebarHeight?this.lifebarHeight:newY;
    var newCropY = this.lifebarHeight - newY;

    var cropRect = {x : 0, y :newCropY , width: this.lifebar.width, height :this.lifebarHeight-newCropY};


    this.lifebar.y =7+newCropY ;
    this.lifebar.crop(cropRect);

    // Update player health
    if (this.player.health < 100) {
        this.healthText.x = 345;
    } else {
        this.healthText.x = 325;
    }
    this.healthText.text = String(this.player.health);
};

/**
 * Updates the xp bar of the player according to its xp
 * @private
 */
UFO.PlayerUi.prototype._updateXpBar = function() {

    var newX = (this.player.exp / this.player.expMax) * this.xpwidth;
    newX = newX<=0?0:newX>= this.xpwidth? this.xpwidth:newX;
    var cropRect = {
        x:0,
        y:0,
        width:newX,
        height : this.xpbar.height
    };
    this.xpbar.crop(cropRect);
};


/**
 * Updates the gem bar of the player according to its gold score
 * @private
 */
UFO.PlayerUi.prototype._updateGemBar = function() {

    var newX = (this.player.gold / this.player.goldMax) * this.gembarWidth;
    newX = newX<=0?0:newX>= this.gembarWidth? this.gembarWidth:newX;

    var cropRect = {
        x:0,
        y:0,
        width:newX,
        height : this.gembar.height
    };

	this.gembar.crop(cropRect);
};

UFO.PlayerUi.prototype._updateStats = function() {

    if (this.player.attack >=10) {
        this.attackText.x = 50;
    } else {
        this.attackText.x = 70;
    }
    if (this.player.defense >=10) {
        this.defenseText.x = 180;
    } else {
        this.defenseText.x = 200;
    }

    this.attackText.text = String(this.player.attack);
    this.defenseText.text  = String(this.player.defense);
};

/**
 * Updates the UI
 */
UFO.PlayerUi.prototype.update = function() {
    this._updateLifeBar();
    this._updateXpBar();
    this._updateGemBar();
    this._updateStats();

    // Display skills
    this.player.skills.forEach(function(skill) {
	    skill.display();
    });



};

